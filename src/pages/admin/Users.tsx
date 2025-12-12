import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminUsers = () => {
  // Mock users data
  const users = [
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com',
      role: 'single',
      eventsAttended: 5,
      showUpRate: 100,
      positiveRate: 95,
      communityTrusted: true,
      status: 'on_time'
    },
    { 
      id: '2', 
      name: 'Mike Chen', 
      email: 'mike@example.com',
      role: 'single',
      eventsAttended: 3,
      showUpRate: 67,
      positiveRate: 80,
      communityTrusted: false,
      status: 'late'
    },
    { 
      id: '3', 
      name: 'Emily Davis', 
      email: 'emily@example.com',
      role: 'team',
      eventsAttended: 12,
      showUpRate: 100,
      positiveRate: 98,
      communityTrusted: true,
      status: 'on_time'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'no_show':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
            <p className="text-muted-foreground">Manage all users and their Community Trusted status</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Events</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Show-up %</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Positive %</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Last Status</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Badge</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'team' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">{user.eventsAttended}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={user.showUpRate >= 90 ? 'text-green-600' : 'text-yellow-600'}>
                          {user.showUpRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={user.positiveRate >= 80 ? 'text-green-600' : 'text-yellow-600'}>
                          {user.positiveRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          {getStatusIcon(user.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {user.communityTrusted ? (
                          <Star className="h-5 w-5 text-primary fill-primary mx-auto" />
                        ) : (
                          <Star className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminUsers;
