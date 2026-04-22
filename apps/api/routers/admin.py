from fastapi import APIRouter

router = APIRouter()


@router.get("/dashboard")
async def dashboard():
    # Returns login counts, study times, test scores, progress rates — filterable by cohort
    raise NotImplementedError


@router.get("/export")
async def export_xlsx():
    # Streams an Excel export of the currently filtered dashboard view
    raise NotImplementedError
