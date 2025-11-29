import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const users = [
    { id: 'USR001', name: 'Alex Johnson', email: 'alex@example.com', summary: 'Healthy, focus on muscle gain.' },
    { id: 'USR002', name: 'Maria Garcia', email: 'maria@example.com', summary: 'Slightly high cholesterol.' },
    { id: 'USR003', name: 'Sam Wilson', email: 'sam@example.com', summary: 'Vegan, needs more protein.' },
    { id: 'USR004', name: 'Linda Chen', email: 'linda@example.com', summary: 'Active, high calorie needs.' },
]

const foodItems = [
    { id: 'FOOD01', name: 'Avocado', category: 'Fruit', calories: 160 },
    { id: 'FOOD02', name: 'Chicken Breast', category: 'Protein', calories: 165 },
    { id: 'FOOD03', name: 'Quinoa', category: 'Grain', calories: 120 },
    { id: 'FOOD04', name: 'Broccoli', category: 'Vegetable', calories: 55 },
]

export default function AdminPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users and application data.</p>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="foodItems">Food Items</TabsTrigger>
          <TabsTrigger value="rules">Recommendation Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                A list of all users in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Health Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="foodItems">
          <Card>
            <CardHeader>
              <CardTitle>Food Items</CardTitle>
              <CardDescription>
                Manage the food database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Calories (per 100g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                      <TableCell className="text-right">{item.calories}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Rules</CardTitle>
              <CardDescription>
                Manage the rules for generating personalized plans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Rule management interface would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
