import { ApiHelpers } from "../../helpers/ApiHelpers";

export default async function deleteLayoutSetPrototype(
	apiHelpers: ApiHelpers,
	layoutSetPrototypeId: string
) {
	await apiHelpers.jsonWebServicesLayoutSetPrototype.deleteLayoutSetPrototypes(
		layoutSetPrototypeId
	);
}