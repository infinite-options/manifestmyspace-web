const contactsContainer = [
    { tab: 'Owner', color: '#3D5CAC' },
    { tab: 'Manager', color: '#3D5CAC' },
    { tab: 'Tenant', color: '#160449' },
    { tab: 'Maintenance', color: '#A52A2A' },
    { tab: 'Employee', color: '#FF8A00' },
];
const getStatusColor = (tab) => {
    for (let i = 0; i < contactsContainer.length; i++) {
        if (contactsContainer[i].tab?.toUpperCase() === tab?.toUpperCase()) {
            return contactsContainer[i].color;
        }
    }
    return '#FFFFFF';
};

export { getStatusColor };
