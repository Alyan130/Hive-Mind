from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import SignUpRequest, LoginRequest, AuthResponse, UserOut
from app.supabase_client import supabase
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignUpRequest):
    """
    Register a new user via Supabase Auth.
    A trigger in the DB automatically creates a row in public.users with role='employee'.
    """
    try:
        response = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {"name": body.name}
            },
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    if not response.session:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signup failed. Email may already be registered.",
        )

    return AuthResponse(
        access_token=response.session.access_token,
        user={
            "id": response.user.id,
            "email": response.user.email,
        },
    )


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    """Login with email + password. Returns a JWT access token."""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password,
        })
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not response.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return AuthResponse(
        access_token=response.session.access_token,
        user={
            "id": response.user.id,
            "email": response.user.email,
        },
    )


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    """Returns the current authenticated user's profile including role."""
    return current_user
