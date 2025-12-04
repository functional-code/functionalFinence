# FunctionalFinance

End-to-End Production Build of an Income Tax Deduction Finder for India.

## Project Structure

- `frontend/`: Next.js + TypeScript application.
- `backend/`: Node.js + Express + TypeScript API.
- `infra/`: Terraform scripts for AWS.
- `scripts/`: Utility scripts for dev and seed.
- `tests/`: E2E and integration tests.

## Quick Start

1.  **Prerequisites**: Node.js 18+, Docker, Docker Compose.
2.  **Install Dependencies**:
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```
3.  **Run Locally**:
    ```bash
    ./dev.sh
    ```

## Documentation

See `implementation_plan.md` for detailed architecture.
