import { LayoutSetPrototype } from "../../../helpers/json-web-services/JSONWebServicesLayoutSetPrototypeApiHelper";

export default async function getLayoutTemplateByName(
    layoutSetPrototypes: LayoutSetPrototype[],
    targetName: string
): Promise<LayoutSetPrototype> {
    const targetLayout = layoutSetPrototypes.find(
        (layoutSetPrototype) =>
            layoutSetPrototype.nameCurrentValue === targetName
    );

    if (targetLayout) {
        return {
            layoutSetPrototypeId: targetLayout.layoutSetPrototypeId,
            nameCurrentValue: targetLayout.nameCurrentValue,
            uuid: targetLayout.uuid,
        };
    }
    else {
        return {
            layoutSetPrototypeId: undefined,
            nameCurrentValue: undefined,
            uuid: undefined,
        };
    }
}