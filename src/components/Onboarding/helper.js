const MaskCharacter = (str, mask, n = 1) => {
  return ("" + str).slice(0, -n).replace(/./g, mask) + ("" + str).slice(-n);
};

const formatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");

  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};

const maskNumber = (value) => {
  const len = value.length;
  const mask = "***-**-****";
  if (len < 4) return mask.slice(0, len);
  if (len < 6) return mask.slice(0, len + 1);
  return mask.slice(0, len + 2);
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Credentials": "*",
};

const roleMap = {
  OWNER: {
    dashboardUrl: "/ownerDashboard",
    profileApi: "/ownerProfile",
  },
  MANAGER: {
    dashboardUrl: "/managerDashboard",
    profileApi: "/businessProfile",
  },
  TENANT: {
    dashboardUrl: "/tenantDashboard",
    profileApi: "/tenantProfile",
  },
  MAINTENANCE: {
    dashboardUrl: "/maintenanceDashboard",
    profileApi: "/businessProfile",
  },
  PM_EMPLOYEE: {
    dashboardUrl: "/managerDashboard",
    profileApi: "/employee",
  },
  MAINT_EMPLOYEE: {
    dashboardUrl: "/maintenanceDashboard",
    profileApi: "/employee",
  },
};

const photoFields = new Set(["owner_photo", "tenant_photo", "business_photo"]);

export {
  MaskCharacter,
  formatPhoneNumber,
  headers,
  maskNumber,
  roleMap,
  photoFields,
};
