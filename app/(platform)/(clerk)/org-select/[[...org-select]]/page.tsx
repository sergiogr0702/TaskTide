import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganization () {
    return (
        <OrganizationList 
            hidePersonal
            afterSelectOrganizationUrl='/organization/:id'
            afterCreateOrganizationUrl='/organization/:id'
        />
    );
};