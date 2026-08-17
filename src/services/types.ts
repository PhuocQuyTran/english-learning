// ─── Backend API response envelope ──────────────────────────────────────────
// Matches backend/src/utils/api-response.ts shapes exactly

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface PaginatedApiResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// ─── Common query params ────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}
