"""Supabase integration stubs for K-IREA API."""

class SupabaseClientStub:
    def table(self, name: str):
        return self

    def select(self, *args, **kwargs):
        return self

    def limit(self, value: int):
        return self

    def execute(self):
        return {"data": [], "status": 200}

supabase_client = SupabaseClientStub()

async def init_supabase() -> None:
    """Initialize Supabase client connection."""
    # TODO: replace with actual Supabase client initialization
    return

async def test_supabase_connection() -> bool:
    """Test Supabase connectivity."""
    # TODO: perform a real health check against Supabase
    return True
