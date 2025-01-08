import { Page } from "@playwright/test";
import { ApiHelpers } from "../../../helpers/ApiHelpers";
import { JournalPage } from "../../journal-web/pages/JournalPage";
import { LayoutSetPrototypePage } from "../pages/LayoutSetPrototypePage";
import { PageEditorPage } from "../../../pages/layout-content-page-editor-web/PageEditorPage";
import { PagesAdminPage } from "../../../pages/layout-admin-web/PagesAdminPage";
import { ProductMenuPage } from "../../../pages/product-navigation-control-menu-web/ProductMenuPage";
import { UIElementsPage } from "../../../pages/uielements/UIElementsPage";
import { WebContentDisplayPage } from "../../../pages/journal-content-web/WebContentDisplayPage";
import { LayoutSetPrototype } from "../../../helpers/json-web-services/JSONWebServicesLayoutSetPrototypeApiHelper";


export default async function createSiteTemplateWithWebContentOnContentPage({
	apiHelpers,
	journalPage,
	layoutSetPrototypePage,
	page,
	pageEditorPage,
	pagesAdminPage,
	productMenuPage,
	templateName,
	text,
	uiElementsPage,
	webContentDisplayPage,
	webContentName,
}: {
	apiHelpers: ApiHelpers;
	journalPage: JournalPage;
	layoutSetPrototypePage: LayoutSetPrototypePage;
	page: Page;
	pageEditorPage: PageEditorPage;
	pagesAdminPage: PagesAdminPage;
	productMenuPage: ProductMenuPage;
	templateName: string;
	text: string;
	uiElementsPage: UIElementsPage;
	webContentDisplayPage: WebContentDisplayPage;
	webContentName: string;
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
	await productMenuPage.goToWebContent();
	await journalPage.goToCreateArticle();
	await journalPage.fillArticleDataSiteTemplate(webContentName, text);
	await journalPage.publishArticle();

	await productMenuPage.goToPages();
	await pagesAdminPage.newButton.click();
	await layoutSetPrototypePage.addTemplatePageButton.waitFor({
		state: 'visible',
	});
	await layoutSetPrototypePage.addTemplatePageButton.click();
	await pagesAdminPage.addPage({
		name: templateName,
	});

	await pageEditorPage.addWidget('Content Management', 'Web Content Display');
	await webContentDisplayPage.addWebContentWithDisplay();
	await uiElementsPage.publishButton.click();
}
