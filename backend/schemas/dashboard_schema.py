from pydantic import BaseModel


class AdminDashboardSummaryResponse(BaseModel):
    total_elections: int
    ongoing_elections: int
    pending_applications: int