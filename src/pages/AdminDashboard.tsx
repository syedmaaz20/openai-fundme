import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import { useMockData } from "@/contexts/MockDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Check, X, Clock, User, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentApplication {
  id: string;
  studentName: string;
  email: string;
  program: string;
  institution: string;
  goal: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: string[];
  photo: string;
  story: string;
}

const AdminDashboard = () => {
  const { currentUser } = useMockData();
  const [selectedStudent, setSelectedStudent] = useState<StudentApplication | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([
    {
      id: '1',
      studentName: 'Maria Rodriguez',
      email: 'maria@student.com',
      program: 'Social Work',
      institution: 'UCLA',
      goal: 15000,
      status: 'pending',
      submittedAt: '2024-01-15',
      documents: ['Fee Receipt', 'Student ID', 'Admission Letter'],
      photo: 'https://randomuser.me/api/portraits/women/75.jpg',
      story: 'I am a first-generation college student studying Social Work at UCLA...'
    },
    {
      id: '2',
      studentName: 'Juan Rodriguez',
      email: 'juan@student.com',
      program: 'Mechanical Engineering',
      institution: 'CalTech',
      goal: 18000,
      status: 'pending',
      submittedAt: '2024-01-14',
      documents: ['Fee Receipt', 'Student ID', 'Transcript'],
      photo: 'https://randomuser.me/api/portraits/men/85.jpg',
      story: 'Coming from a low-income family, I have always dreamed of becoming an engineer...'
    }
  ]);

  const handleViewDetails = (student: StudentApplication) => {
    setSelectedStudent(student);
  };

  const handleApprove = (studentId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === studentId 
          ? { ...app, status: 'approved' as const }
          : app
      )
    );
    toast({
      title: "Student Approved",
      description: "The student's campaign has been approved and is now live.",
    });
    setSelectedStudent(null);
  };

  const handleReject = (studentId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === studentId 
          ? { ...app, status: 'rejected' as const }
          : app
      )
    );
    toast({
      title: "Student Rejected",
      description: "The student's application has been rejected.",
      variant: "destructive",
    });
    setSelectedStudent(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock size={12} className="mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-300"><Check size={12} className="mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-300"><X size={12} className="mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    rejectedApplications: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-6xl mx-auto space-y-6 mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats.totalApplications}</div>
                <p className="text-sm text-gray-600">Total Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats.pendingApplications}</div>
                <p className="text-sm text-gray-600">Pending Review</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats.approvedApplications}</div>
                <p className="text-sm text-gray-600">Approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <X className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-xl font-bold">{stats.rejectedApplications}</div>
                <p className="text-sm text-gray-600">Rejected</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={application.photo}
                        alt={application.studentName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{application.studentName}</h3>
                        <p className="text-sm text-gray-600">{application.program} at {application.institution}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <DollarSign size={14} className="text-green-500" />
                          <span className="text-sm">${application.goal.toLocaleString()} goal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(application.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(application)}
                      >
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.studentName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedStudent.studentName}</h2>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.program} at {selectedStudent.institution}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="font-semibold">${selectedStudent.goal.toLocaleString()} funding goal</span>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedStudent.status)}
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(selectedStudent.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Student's Story</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedStudent.story}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Supporting Documents</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedStudent.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedStudent.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(selectedStudent.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check size={16} className="mr-2" />
                    Approve Campaign
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedStudent.id)}
                    className="flex-1"
                  >
                    <X size={16} className="mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
