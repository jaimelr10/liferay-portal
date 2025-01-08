import { ApiHelpers } from "../../../helpers/ApiHelpers";

export default async function deleteSiteAndLayoutSetPrototypes(
    apiHelpers: ApiHelpers,
    siteId: string,
    ...layoutSetPrototypeIds: string[]
) {
    let response = await apiHelpers.headlessSite.deleteSite(siteId);
    if (!response.ok()) {
        response = await apiHelpers.headlessSite.deleteSite(siteId);
    }
    expect(response.ok()).toBe(true);
    for (const prototypeId of layoutSetPrototypeIds) {
        await apiHelpers.jsonWebServicesLayoutSetPrototype.deleteLayoutSetPrototypes(
            prototypeId
        );
    }
}
