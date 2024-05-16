import { auth } from "@clerk/nextjs/server";
import { OrganizationControl } from "./_components/organizationControl";
import { startCase } from "lodash";

export async function generateMetadata() {
    const { orgSlug } = auth();

    return {
        title: startCase(orgSlug || 'Organization'),
    };
};

const OrgIdLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <OrganizationControl /> 
            {children}
        </>
    );
};

export default OrgIdLayout;