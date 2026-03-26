import re

def rewrite_dashboard():
    with open('src/pages/Dashboard.jsx', 'r') as f:
        content = f.read()

    # Replace state id with _id
    content = content.replace("id: null,", "_id: null,")
    content = content.replace("c.id", "c._id")
    content = content.replace("formData.id", "formData._id")

    # Replace useEffect loading
    old_effect = """    useEffect(() => {
        const allComplaints = JSON.parse(localStorage.getItem('complaints')) || [];
        // Only show user's own complaints (Filtering data)
        const userComplaints = allComplaints.filter(c => c.userId === user.id);
        setComplaints(userComplaints);
    }, [user.id]);"""
    new_effect = """    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch('/api/complaints');
                const data = await res.json();
                const userComplaints = data.filter(c => c.userId === user.id);
                setComplaints(userComplaints);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComplaints();
    }, [user.id]);"""
    content = content.replace(old_effect, new_effect)

    # Replace handleSubmit
    old_submit = """        const allComplaints = JSON.parse(localStorage.getItem('complaints')) || [];

        if (isEditing) {
            const updatedAll = allComplaints.map(c => c._id === formData._id ? { ...formData, userId: user.id, userName: user.name } : c);
            localStorage.setItem('complaints', JSON.stringify(updatedAll));
            setComplaints(updatedAll.filter(c => c.userId === user.id));
            setMessage({ type: 'success', text: 'Report updated successfully!' });
        } else {
            const newComplaint = {
                ...formData,
                id: Date.now(),
                userId: user.id,
                userName: user.name,
                createdAt: new Date().toISOString()
            };

            const updatedAll = [newComplaint, ...allComplaints];
            localStorage.setItem('complaints', JSON.stringify(updatedAll));
            setComplaints([newComplaint, ...complaints]);
            setMessage({ type: 'success', text: 'Complaint submitted successfully!' });
        }"""
    
    new_submit = """        const processSubmission = async () => {
            try {
                if (isEditing) {
                    const res = await fetch(`/api/complaints/${formData._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...formData, userId: user.id, userName: user.name })
                    });
                    const updatedComplaint = await res.json();
                    setComplaints(complaints.map(c => c._id === updatedComplaint._id ? updatedComplaint : c));
                    setMessage({ type: 'success', text: 'Report updated successfully!' });
                } else {
                    const newComplaintData = {
                        ...formData,
                        userId: user.id,
                        userName: user.name,
                    };
                    const res = await fetch('/api/complaints', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newComplaintData)
                    });
                    const newComplaint = await res.json();
                    setComplaints([newComplaint, ...complaints]);
                    setMessage({ type: 'success', text: 'Complaint submitted successfully!' });
                }
            } catch (err) {
                setMessage({ type: 'error', text: 'Server error!' });
            }
        };
        processSubmission();"""
    content = content.replace(old_submit, new_submit)

    # Replace handleDelete
    old_delete = """    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            const allComplaints = JSON.parse(localStorage.getItem('complaints')) || [];
            const updatedAll = allComplaints.filter(c => c._id !== id);
            localStorage.setItem('complaints', JSON.stringify(updatedAll));

            setComplaints(complaints.filter(c => c._id !== id));
            setMessage({ type: 'error', text: 'Report deleted' });
            setTimeout(() => setMessage(null), 3000);
        }
    };"""
    new_delete = """    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
                setComplaints(complaints.filter(c => c._id !== id));
                setMessage({ type: 'error', text: 'Report deleted' });
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                setMessage({ type: 'error', text: 'Server error!' });
            }
        }
    };"""
    content = content.replace(old_delete, new_delete)

    with open('src/pages/Dashboard.jsx', 'w') as f:
        f.write(content)

def rewrite_adminpanel():
    with open('src/pages/AdminPanel.jsx', 'r') as f:
        content = f.read()

    content = content.replace("c.id", "c._id")

    # Replace load complaints
    old_load = """    // Load all complaints on mount
    useEffect(() => {
        const allComplaints = JSON.parse(localStorage.getItem('complaints')) || [];
        setComplaints(allComplaints);
    }, []);"""
    new_load = """    // Load all complaints on mount
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch('/api/complaints');
                const data = await res.json();
                setComplaints(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComplaints();
    }, []);"""
    content = content.replace(old_load, new_load)

    # Replace updateStatus
    old_update = """    const updateStatus = (id, newStatus) => {
        const allComplaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const updated = allComplaints.map(c => {
            if (c._id === id) {
                return { ...c, status: newStatus };
            }
            return c;
        });

        localStorage.setItem('complaints', JSON.stringify(updated));
        setComplaints(updated);

        if (selectedComplaint?._id === id) {
            setSelectedComplaint({ ...selectedComplaint, status: newStatus });
        }
    };"""
    new_update = """    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const updatedComplaint = await res.json();
            
            const updated = complaints.map(c => c._id === id ? { ...c, status: newStatus } : c);
            setComplaints(updated);

            if (selectedComplaint?._id === id) {
                setSelectedComplaint({ ...selectedComplaint, status: newStatus });
            }
        } catch(err) {
            console.error(err);
        }
    };"""
    content = content.replace(old_update, new_update)

    # Replace deleteComplaint
    old_delete = """    const deleteComplaint = (id) => {
        if (window.confirm('Admin: Permanently delete this record?')) {
            const allComplaints = JSON.parse(localStorage.getItem('complaints')) || [];
            const updated = allComplaints.filter(c => c._id !== id);
            localStorage.setItem('complaints', JSON.stringify(updated));
            setComplaints(updated);
        }
    };"""
    new_delete = """    const deleteComplaint = async (id) => {
        if (window.confirm('Admin: Permanently delete this record?')) {
            try {
                await fetch(`/api/complaints/${id}`, { method: 'DELETE' });
                const updated = complaints.filter(c => c._id !== id);
                setComplaints(updated);
            } catch(err) {
                console.error(err);
            }
        }
    };"""
    content = content.replace(old_delete, new_delete)

    with open('src/pages/AdminPanel.jsx', 'w') as f:
        f.write(content)

rewrite_dashboard()
rewrite_adminpanel()
print("Rewrite complete")
