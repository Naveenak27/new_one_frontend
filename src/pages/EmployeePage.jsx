
// import React, { useState } from 'react';
// import EmployeeList from '../components/Employee/EmployeeList';
// import EmployeeFormModal from '../components/Employee/EmployeeForm';
// const EmployeePage = () => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editingEmployee, setEditingEmployee] = useState(null);

//     const handleShowModal = (employee = null) => {
//         setEditingEmployee(employee);
//         setModalVisible(true);
//     };

//     const handleCloseModal = () => {
//         setEditingEmployee(null);
//         setModalVisible(false);
//     };

//     return (
//         <div>
//             <EmployeeList onShowForm={handleShowModal} />
//             <EmployeeFormModal
//                 visible={modalVisible}
//                 employee={editingEmployee}
//                 onClose={handleCloseModal}
//             />
//         </div>
//     );
// };

// export default EmployeePage;


import React, { useState } from 'react';
import EmployeeList from '../components/Employee/EmployeeList';
import EmployeeFormDrawer from '../components/Employee/EmployeeForm';
const EmployeePage = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const handleShowDrawer = (employee = null) => {
        setEditingEmployee(employee);
        setDrawerVisible(true);
    };

    const handleCloseDrawer = () => {
        setEditingEmployee(null);
        setDrawerVisible(false);
    };

    return (
        <div>
            <EmployeeList onShowForm={handleShowDrawer} />
            <EmployeeFormDrawer
                visible={drawerVisible}
                employee={editingEmployee}
                onClose={handleCloseDrawer}
            />
        </div>
    );
};

export default EmployeePage;
