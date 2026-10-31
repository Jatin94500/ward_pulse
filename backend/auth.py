from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader, APIKeyQuery
from backend.config import API_KEY, API_KEY_NAME

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
api_key_query = APIKeyQuery(name="api_key", auto_error=False)

def verify_api_key(
    header_key: str = Security(api_key_header),
    query_key: str = Security(api_key_query)
) -> str:
    """
    Validates API Key provided either via header (X-API-Key) or query param (?api_key=).
    Configured for interactive Swagger UI authorization.
    """
    provided_key = header_key or query_key
    if not provided_key or provided_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key. Please provide a valid 'X-API-Key' header.",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return provided_key
