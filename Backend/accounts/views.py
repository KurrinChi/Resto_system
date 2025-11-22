import json
import hashlib
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from .models import Customer

def hash_password(password):
    """Simple password hashing using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

@csrf_exempt
def register(request):
    """Register new customer user"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    # Validate required fields
    required = ['id', 'name', 'email', 'password']
    missing = [field for field in required if not data.get(field)]
    if missing:
        return JsonResponse({'error': f'Missing required fields: {", ".join(missing)}'}, status=400)

    # Check if email already exists
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email = %s", [data.get('email')])
            if cursor.fetchone():
                return JsonResponse({'error': 'Email already registered'}, status=409)
    except Exception as e:
        return JsonResponse({'error': f'Database error: {str(e)}'}, status=500)

    # Hash password
    password_hash = hash_password(data['password'])
    
    # Prepare data with defaults
    current_time = datetime.now().isoformat()
    
    user_data = {
        'id': data['id'],
        'fullName': data.get('fullName', ''),
        'name': data.get('name', ''),
        'email': data.get('email', ''),
        'phoneNumber': data.get('phoneNumber', ''),
        'phone': data.get('phone', ''),
        'address': data.get('address', ''),
        'bio': data.get('bio', ''),
        'role': 'Customer',  # Force Customer role
        'status': data.get('status', 'active'),
        'avatar': data.get('avatar', ''),
        'password_hash': password_hash,
        'login_attempts': 0,
        'createdAt': current_time,
        'created_at': current_time,
        'lastLogin': None,
        'updated_at': current_time,
    }

    # Insert into database
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO users (
                    id, fullName, name, email, phoneNumber, phone, address, bio,
                    role, status, avatar, password_hash, login_attempts,
                    createdAt, created_at, lastLogin, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, [
                user_data['id'],
                user_data['fullName'],
                user_data['name'],
                user_data['email'],
                user_data['phoneNumber'],
                user_data['phone'],
                user_data['address'],
                user_data['bio'],
                user_data['role'],
                user_data['status'],
                user_data['avatar'],
                user_data['password_hash'],
                user_data['login_attempts'],
                user_data['createdAt'],
                user_data['created_at'],
                user_data['lastLogin'],
                user_data['updated_at'],
            ])
            
        # Return success without sensitive data
        return JsonResponse({
            'success': True,
            'id': user_data['id'],
            'fullName': user_data['fullName'],
            'name': user_data['name'],
            'email': user_data['email'],
            'role': user_data['role'],
            'phoneNumber': user_data['phoneNumber'],
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'error': f'Failed to create user: {str(e)}',
            'details': 'Could not insert user into database'
        }, status=500)


@csrf_exempt
def login(request):
    """Login user"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    # Hash the provided password
    password_hash = hash_password(password)

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, fullName, name, email, phoneNumber, role, status, avatar
                FROM users 
                WHERE email = %s AND password_hash = %s
            """, [email, password_hash])
            
            row = cursor.fetchone()
            
            if not row:
                return JsonResponse({'error': 'Invalid email or password'}, status=401)
            
            if row[6] != 'active':  # status column
                return JsonResponse({'error': 'Account is not active'}, status=403)
            
            # Update last login
            cursor.execute("""
                UPDATE users 
                SET lastLogin = %s, login_attempts = 0, updated_at = %s
                WHERE id = %s
            """, [datetime.now().isoformat(), datetime.now().isoformat(), row[0]])
            
            return JsonResponse({
                'success': True,
                'id': row[0],
                'fullName': row[1],
                'name': row[2],
                'email': row[3],
                'phoneNumber': row[4],
                'role': row[5],
                'avatar': row[7],
            }, status=200)
            
    except Exception as e:
        return JsonResponse({
            'error': f'Login failed: {str(e)}'
        }, status=500)


@csrf_exempt
def update_address(request):
    """Update user's address"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    user_id = data.get('userId')
    address = data.get('address', '')

    if not user_id:
        return JsonResponse({'error': 'User ID is required'}, status=400)

    try:
        with connection.cursor() as cursor:
            # Update address
            cursor.execute("""
                UPDATE users 
                SET address = %s, updated_at = %s
                WHERE id = %s
            """, [address, datetime.now().isoformat(), user_id])
            
            if cursor.rowcount == 0:
                return JsonResponse({'error': 'User not found'}, status=404)
            
            return JsonResponse({
                'success': True,
                'message': 'Address updated successfully'
            }, status=200)
            
    except Exception as e:
        return JsonResponse({
            'error': f'Failed to update address: {str(e)}'
        }, status=500)


@csrf_exempt
def update_profile(request):
    """Update user's profile including name, email, avatar, contact, and address (no birthday column)"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    user_id = data.get('userId')
    if not user_id:
        return JsonResponse({'error': 'User ID is required'}, status=400)

    # Extract fields
    name = data.get('name', '')
    email = data.get('email', '')
    avatar = data.get('avatar', '')
    contact_number = data.get('contactNumber', '')
    address = data.get('address', '')
    current_time = datetime.now().isoformat()

    try:
        with connection.cursor() as cursor:
            # Check if email is already taken by another user
            if email:
                cursor.execute("""
                    SELECT id FROM users WHERE email = %s AND id != %s
                """, [email, user_id])
                if cursor.fetchone():
                    return JsonResponse({'error': 'Email already in use by another account'}, status=409)

            # Update profile
            cursor.execute("""
                UPDATE users 
                SET name = %s, fullName = %s, email = %s, avatar = %s, 
                    phoneNumber = %s, phone = %s, address = %s, 
                    updated_at = %s
                WHERE id = %s
            """, [name, name, email, avatar, contact_number, contact_number, address, current_time, user_id])
            
            if cursor.rowcount == 0:
                return JsonResponse({'error': 'User not found'}, status=404)
            
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully'
            }, status=200)
            
    except Exception as e:
        return JsonResponse({
            'error': f'Failed to update profile: {str(e)}'
        }, status=500)

@csrf_exempt
def get_user(request, user_id):
    """Fetch a user's current data by ID (excluding birthday - column not present)"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, fullName, name, email, phoneNumber, phone, address, avatar, role, status
                FROM users WHERE id = %s
            """, [user_id])
            row = cursor.fetchone()
            if not row:
                return JsonResponse({'error': 'User not found'}, status=404)
            return JsonResponse({
                'id': row[0],
                'fullName': row[1],
                'name': row[2],
                'email': row[3],
                'phoneNumber': row[4],
                'phone': row[5],
                'address': row[6],
                'avatar': row[7],
                'role': row[8],
                'status': row[9],
            }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'Failed to fetch user: {str(e)}'}, status=500)
