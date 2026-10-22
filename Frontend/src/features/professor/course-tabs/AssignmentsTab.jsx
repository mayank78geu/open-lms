import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { FileUploader } from '../../../components/ui/FileUploader';
import {
  listCourseAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../../../lib/api/assignmentsApi';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  FileText,
  Users,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

export function AssignmentsTab({ courseId, course }) {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const data = await listCourseAssignments(courseId);
      setAssignments(data || []);
    } catch (err) {
      console.error('Failed to load course assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  const openCreateModal = () => {
    setEditingAssignment(null);
    setTitle('');
    setDescription('');
    // Default to 7 days from now
    const d = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    setDueDate(d.toISOString().slice(0, 16));
    setMaxMarks('100');
    setAttachmentUrl('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingAssignment(a);
    setTitle(a.title || '');
    setDescription(a.description || '');
    if (a.dueDate) {
      try {
        setDueDate(new Date(a.dueDate).toISOString().slice(0, 16));
      } catch (e) {
        setDueDate('');
      }
    } else {
      setDueDate('');
    }
    setMaxMarks(String(a.maxMarks || a.maxPoints || 100));
    setAttachmentUrl(a.attachmentUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteAssignment(assignmentId);
      fetchAssignments();
    } catch (err) {
      alert(err.message || 'Cannot delete assignment.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || title.length < 3) {
      setFormError('Title must be at least 3 characters.');
      return;
    }

    if (!dueDate) {
      setFormError('Due date is required.');
      return;
    }

    const marksNum = Number(maxMarks);
    if (!marksNum || marksNum < 1) {
      setFormError('Max marks must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        dueDate: new Date(dueDate).toISOString(),
        maxMarks: marksNum,
        attachmentUrl: attachmentUrl.trim() || null,
      };

      if (editingAssignment) {
        await updateAssignment(editingAssignment.assignmentId, payload);
      } else {
        await createAssignment(courseId, payload);
      }

      setIsModalOpen(false);
      fetchAssignments();
    } catch (err) {
      console.error('Failed to save assignment:', err);
      setFormError(err.message || 'Failed to save assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-border p-6 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-ink">Course Assignments</h3>
          <p className="text-xs text-ink-muted">Publish homework, projects, and deadlines.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={openCreateModal}
        >
          Create Assignment
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-ink-muted">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-ink">No assignments created yet</p>
          <p className="text-[11px] text-ink-muted mt-0.5 mb-3">
            Add your first assignment to set syllabus expectations for students.
          </p>
          <Button
            variant="outline"
            size="xs"
            icon={Plus}
            onClick={openCreateModal}
          >
            Create Assignment
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const dueDate = a.dueDate ? new Date(a.dueDate) : null;
            const dueLabel = dueDate
              ? dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'No due date';

            return (
              <div
                key={a.assignmentId}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-ink-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {dueLabel}
                    </span>
                    <Badge variant="brand" size="xs">
                      {a.maxMarks || a.maxPoints || 100} pts
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-ink">{a.title}</h4>
                  {a.description && (
                    <p className="text-xs text-ink-muted line-clamp-1 max-w-xl">{a.description}</p>
                  )}
                  {a.attachmentUrl && (
                    <a
                      href={a.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:underline pt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" /> Attachment Link
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Users}
                    onClick={() => navigate(`/professor/submissions?courseId=${courseId}&assignmentId=${a.assignmentId}`)}
                  >
                    Submissions
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Edit2}
                    onClick={() => openEditModal(a)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    icon={Trash2}
                    onClick={() => handleDelete(a.assignmentId)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
        description="Configure title, deadline, instructions, and max marks."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink">Assignment Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Lab Report 3: Membrane Transport"
              className="w-full px-3 py-2 text-xs rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink">Description / Instructions</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed submission guidelines..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink">Due Date & Time</label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink">Maximum Marks</label>
              <input
                type="number"
                min="1"
                max="1000"
                required
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink">Assignment Handout / Document (Cloudinary)</label>
            <FileUploader
              folder="assignments"
              label="Upload assignment instructions, rubric, or starter files (up to 10MB)"
              onUploadSuccess={(res) => setAttachmentUrl(res.fileUrl || res.url)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-ink">Attachment URL (Optional)</label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-ink-border focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
