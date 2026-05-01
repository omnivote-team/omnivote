from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models.user_model import User
from routers import auth_router
from models.institution_model import Institution
from routers import institution_router
from models.department_model import Department
from routers import department_router
from models.batch_model import Batch
from routers import batch_router
from models.section_model import Section
from routers import section_router
from routers import admin_router
from models.election_model import Election
from routers import election_router
from models.candidate_application_model import CandidateApplication
from routers import candidate_application_router
from routers import candidate_router
from routers import vote_router
from routers import result_router
from routers.dashboard_router import router as dashboard_router
from routers.public_election_router import router as public_election_router
from routers.user_election_router import router as user_election_router

app = FastAPI(title="OmniVote API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router.router)
app.include_router(institution_router.router)
app.include_router(department_router.router)
app.include_router(batch_router.router)
app.include_router(section_router.router)
app.include_router(admin_router.router)
app.include_router(election_router.router)
app.include_router(candidate_application_router.router)
app.include_router(candidate_router.router)
app.include_router(vote_router.router)
app.include_router(result_router.router)
app.include_router(dashboard_router)
app.include_router(public_election_router)
app.include_router(user_election_router)


Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "OmniVote backend is running"}


@app.get("/test-db")
def test_db():
    connection = engine.connect()
    connection.close()

    return {"message": "Database connected successfully"}