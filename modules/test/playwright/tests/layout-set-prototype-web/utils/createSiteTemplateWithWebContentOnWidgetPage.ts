import { Page } from "@playwright/test";
import { ApiHelpers } from "../../../helpers/ApiHelpers";
import { JournalPage } from "../../journal-web/pages/JournalPage";
import { PagesAdminPage } from "../../../pages/layout-admin-web/PagesAdminPage";
import { ProductMenuPage } from "../../../pages/product-navigation-control-menu-web/ProductMenuPage";
import { UIElementsPage } from "../../../pages/uielements/UIElementsPage";
import { WebContentDisplayPage } from "../../../pages/journal-content-web/WebContentDisplayPage";
import { WidgetPagePage } from "../../../pages/layout-admin-web/WidgetPagePage";
import { LayoutSetPrototype } from "../../../helpers/json-web-services/JSONWebServicesLayoutSetPrototypeApiHelper";
import getBasicWebContentStructureId from "../../../utils/structured-content/getBasicWebContentStructureId";

export default async function createSiteTemplateWithWebContentOnWidgetPage({
    apiHelpers,
    page,
    pagesAdminPage,
    productMenuPage,
    templateName,
    text,
    webContentName,
    widgetPagePage,
    site
}: {
    apiHelpers: ApiHelpers;
    page: Page;
    pagesAdminPage: PagesAdminPage;
    productMenuPage: ProductMenuPage;
    templateName: string;
    text: string;
    webContentName: string;
    widgetPagePage: WidgetPagePage;
    site: Site;
}): Promise<void> {
    const layoutSetPrototype: LayoutSetPrototype =
        await apiHelpers.jsonWebServicesLayoutSetPrototype.addLayoutSetPrototypes(
            templateName
        );
    await page.goto(
        'group/template-' + layoutSetPrototype.layoutSetPrototypeId
    );

    await productMenuPage.checkIfAdecuateProductMenu(templateName);
    await productMenuPage.openProductMenuIfClosed();

    const basicWebContentStructureId =
        await getBasicWebContentStructureId(apiHelpers);

    // await apiHelpers.jsonWebServicesJournal.addWebContent({
    // 	ddmStructureId: layoutSetPrototype.uuid,
    // 	groupId: site.id,
    // 	titleMap: {en_US: webContentName},
    // 	content: text,
    // });

    await apiHelpers.jsonWebServicesJournal.addWebContent({
        ddmStructureId: basicWebContentStructureId,
        groupId: site.id,
        titleMap: {en_US: webContentName},
        content: text,
    });

    await productMenuPage.goToPages();

    await page
        .locator('.control-menu-level-1-heading')
        .filter({hasText: 'Pages'})
        .waitFor();

    await pagesAdminPage.addWidgetPage({
        addButtonLabel: 'Add Site Template Page',
        name: templateName,
    });


    await productMenuPage.clickSpecificPage(templateName);
    await widgetPagePage.addButton.click();
    await widgetPagePage.addPortlet('Web Content Display');
    //await webContentDisplayPage.addWebContentWithWidget();
    // await uiElementsPage.setupUpdatedAlert.waitFor({state: 'hidden'});
    // await uiElementsPage.closeClickable.click();
    // await uiElementsPage.closeClickable.waitFor({
    // 	state: 'hidden',
    // });
}
