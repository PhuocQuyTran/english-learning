import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/routes/PrivateRoute";
import VocabularyPage from "@/pages/VocabularyPage";
const VocabularyDetailPage = lazy(() => import("@/pages/VocabularyDetailPage"));

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ReviewPage = lazy(() => import("@/pages/ReviewPage"));
const ReviewHistoryPage = lazy(() => import("@/pages/ReviewHistoryPage"));
const ListeningPage = lazy(() => import("@/pages/ListeningPage"));
const ListeningUploadPage = lazy(
  () => import("@/components/listening/ListeningUploadPage"),
);
const ListeningDetailPage = lazy(() => import("@/pages/ListeningDetailPage"));

function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },

  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "vocabulary",
        element: (
          <div className="text-muted-foreground">
            <VocabularyPage />
          </div>
        ),
      },
      {
        path: "vocabulary/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <VocabularyDetailPage />
          </Suspense>
        ),
      },
      {
        path: "flashcards",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReviewPage />
          </Suspense>
        ),
      },
      {
        path: "flashcards/history",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReviewHistoryPage />
          </Suspense>
        ),
      },
      {
        path: "listening",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ListeningPage />
          </Suspense>
        ),
      },
      {
        path: "listening/upload",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ListeningUploadPage />
          </Suspense>
        ),
      },
      {
        path: "listening/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ListeningDetailPage />
          </Suspense>
        ),
      },
      {
        path: "notes",
        element: (
          <div className="p-8 text-muted-foreground">Notes — coming soon</div>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <a
          href="/dashboard"
          className="text-primary underline-offset-4 hover:underline"
        >
          Go to dashboard
        </a>
      </div>
    ),
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
