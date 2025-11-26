"use client"

import { useAuth } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { fetchUserPlanTrips } from "@/fetch/plan-trip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PlannedTripsDebug() {
  const { user } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userPlanTrips", user?.documentId],
    queryFn: () => fetchUserPlanTrips(user?.documentId),
    enabled: !!user?.documentId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Info - Planned Trips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">User Info:</h3>
          <pre className="bg-muted p-3 rounded text-xs overflow-auto">
            {JSON.stringify(
              {
                documentId: user?.documentId,
                email: user?.email,
                username: user?.username,
              },
              null,
              2
            )}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Query Status:</h3>
          <pre className="bg-muted p-3 rounded text-xs">
            {JSON.stringify(
              {
                isLoading,
                isError,
                hasData: !!data,
                tripCount: data?.data?.length || 0,
              },
              null,
              2
            )}
          </pre>
        </div>

        {isError && (
          <div>
            <h3 className="font-semibold mb-2 text-destructive">Error:</h3>
            <pre className="bg-destructive/10 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {data && (
          <div>
            <h3 className="font-semibold mb-2">Response Data:</h3>
            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        <Button onClick={() => refetch()}>Refetch Data</Button>
      </CardContent>
    </Card>
  );
}
