type DataSchema = {
    [property_uid: string]: Array<{
            color: string;
            status: string;
            requests: Array<MaintenanceRequest>;
        }>
};

type MaintenanceRequest = {
    property_uid: string;
    property_address: string;
    property_unit: string;
    property_city: string;
    property_state: string;
    property_zip: string;
    property_type: string;
    property_num_beds: number;
    property_num_baths: number;
    property_area: number;
    maintenance_request_uid: string;
    maintenance_property_id: string;
    maintenance_request_status: string;
    maintenance_title: string;
    maintenance_desc: string;
    maintenance_images: string; // this appears to be a string representation of a JSON array
    maintenance_request_type: string;
    maintenance_request_created_by: string;
    maintenance_priority: string;
    maintenance_can_reschedule: number;
    maintenance_assigned_business: string;
    maintenance_assigned_worker: null | string;
    maintenance_scheduled_date: null | string;
    maintenance_scheduled_time: null | string;
    maintenance_frequency: string;
    maintenance_notes: string;
    maintenance_request_created_date: string;
    maintenance_request_closed_date: string;
    maintenance_request_adjustment_date: string;
};