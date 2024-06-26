import Swal from 'sweetalert2';

type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

export const buttons = Swal.mixin({
    customClass: {
        confirmButton: '', 
        cancelButton: '', 
        popup: '' 
    },
    buttonsStyling: false
});

export const showDeleteConfirmation = () => {
    return buttons.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir los cambios!",
        icon: "warning",
        width: '400',
        showCancelButton: true,
        confirmButtonText: "<span style='color: white; background-color: #D10202; padding: 10px 20px; border-radius: 20px; margin-left: 20px;'>Eliminar</span>",
        cancelButtonText: "<span style='color: white; background-color: #5E5D5D; padding: 10px 20px; border-radius: 20px; '>Cancelar</span>",
        reverseButtons: true
    });
};

export const showCustomAlert = (title: string, text: string, icon: SweetAlertIcon) => {
    return buttons.fire({
        title: title,
        width: '400',
        text: text,
        icon: icon,
        confirmButtonText: "<span style='color: white; background-color: #D10202; padding: 10px 20px; border-radius: 20px;'>Aceptar</span>"
    });
};

export const showDeletionCancelled = () => {
    buttons.fire({
        title: "Cancelado",
        width: '400',
        text: "El elemento no se ha eliminado ",
        icon: "error"
    });
};