document.addEventListener('DOMContentLoaded', function() {
    // Toggle staff creation modal
    const staffModal = document.querySelector('.create-staff');
    const openModalButtons = document.querySelectorAll('.add-option');
    const closeModalButton = document.getElementById('closestaff');

    function openStaffModal() {
        staffModal.classList.add('open');
    }

    function closeStaffModal() {
        staffModal.classList.remove('open');
    }

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', openStaffModal);
    });

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeStaffModal);
    }

    staffModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeStaffModal();
        }
    });

    // Toggle delete staff modal
    const deleteModal = document.querySelector('.delete-staff');
    const deleteopenModalButtons = document.querySelectorAll('.delete');
    const deletecloseModalButton = document.getElementById('closeDelete');

    function openDeleteModal() {
        deleteModal.classList.add('open');
    }

    function closeDeleteModal() {
        deleteModal.classList.remove('open');
    }

    deleteopenModalButtons.forEach(btn => {
        btn.addEventListener('click', openDeleteModal);
    });

    if (deletecloseModalButton) {
        deletecloseModalButton.addEventListener('click', closeDeleteModal);
    }

    deleteModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });
});