document.addEventListener('DOMContentLoaded', function() {
    // Toggle staff creation modal
    const staffModal = document.querySelector('.create-staff');
    const openModalButtons = document.querySelectorAll('.staff');
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







    const supplierModal = document.querySelector('.create-supplier');
    const supplierOpenModalButtons = document.querySelectorAll('.supplier');
    const supplierCloseModalButton = document.getElementById('closeSupplier');

    function openSupplierModal() {
        supplierModal.classList.add('open');
    }

    function closeSupplierModal() {
        supplierModal.classList.remove('open');
    }

    supplierOpenModalButtons.forEach(btn => {
        btn.addEventListener('click', openSupplierModal);
    });

    if (supplierCloseModalButton) {
        supplierCloseModalButton.addEventListener('click', closeSupplierModal);
    }

    supplierModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSupplierModal();
        }
    });


     const deactivateModal = document.querySelector('.deactivate-supplier');
    const deactivateOpenButtons = document.querySelectorAll('.deactivate');
    const deactivateCloseButton = document.getElementById('closeDeactivate');
    const deactivateReasonSelect = document.getElementById('deactivateReason');
    const otherReasonGroup = document.getElementById('otherReasonGroup');

    function openDeactivateModal() {
        deactivateModal.classList.add('open');
    }

    function closeDeactivateModal() {
        deactivateModal.classList.remove('open');
    }

    deactivateOpenButtons.forEach(btn => {
        btn.addEventListener('click', openDeactivateModal);
    });

    if (deactivateCloseButton) {
        deactivateCloseButton.addEventListener('click', closeDeactivateModal);
    }

    deactivateModal?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDeactivateModal();
        }
    });

    if (deactivateReasonSelect && otherReasonGroup) {
        deactivateReasonSelect.addEventListener('change', function() {
            otherReasonGroup.style.display = this.value === 'other' ? 'block' : 'none';
        });
    }

    function submitDeactivateForm() {
        const formValid = document.getElementById('confirmDeactivate').checked && 
                         document.getElementById('deactivateReason').value !== '';
        
        if (formValid) {
            // Form is valid, proceed with deactivation
            console.log('Supplier deactivated');
            closeDeactivateModal();
            // Add your actual deactivation logic here
        } else {
            // Form is invalid
            alert('Please select a reason and confirm deactivation');
        }
    }

    // Attach the submit function to your button
    const submitDeactivateButton = document.querySelector('.btn-danger[onclick="submitDeactivateForm()"]');
    if (submitDeactivateButton) {
        submitDeactivateButton.addEventListener('click', submitDeactivateForm);
    }
    



    const messageModal = document.querySelector('.message-modal');
const messageOpenModalButtons = document.querySelectorAll('.message');
const messageCloseModalButton = document.getElementById('closeMessage');

function openMessageModal() {
    messageModal.classList.add('open');
}

function closeMessageModal() {
    messageModal.classList.remove('open');
}

messageOpenModalButtons.forEach(btn => {
    btn.addEventListener('click', openMessageModal);
});

if (messageCloseModalButton) {
    messageCloseModalButton.addEventListener('click', closeMessageModal);
}

messageModal?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeMessageModal();
    }
});
});