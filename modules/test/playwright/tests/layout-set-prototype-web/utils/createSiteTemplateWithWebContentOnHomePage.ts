import { Page } from "@playwright/test";
import { ApiHelpers } from "../../../helpers/ApiHelpers";
import { ApplicationsMenuPage } from "../../../pages/product-navigation-applications-menu/ApplicationsMenuPage";
import { JournalPage } from "../../journal-web/pages/JournalPage";
import { LayoutSetPrototypePage } from "../pages/LayoutSetPrototypePage";
import { PageEditorPage } from "../../../pages/layout-content-page-editor-web/PageEditorPage";
import { ProductMenuPage } from "../../../pages/product-navigation-control-menu-web/ProductMenuPage";
import { UIElementsPage } from "../../../pages/uielements/UIElementsPage";
import { WebContentDisplayPage } from "../../../pages/journal-content-web/WebContentDisplayPage";
import { LayoutSetPrototype } from "../../../helpers/json-web-services/JSONWebServicesLayoutSetPrototypeApiHelper";

export default async function createSiteTemplateWithWebContentOnHomePage({
	apiHelpers,
	journalPage,
	layoutSetPrototypePage,
	page,
	pageEditorPage,
	productMenuPage,
	templateName,
	text,
	uiElementsPage,
	webContentDisplayPage,
	webContentName,
}: {
	apiHelpers: ApiHelpers;
	applicationsMenuPage: ApplicationsMenuPage;
	journalPage: JournalPage;
	layoutSetPrototypePage: LayoutSetPrototypePage;
	page: Page;
	pageEditorPage: PageEditorPage;
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
	await layoutSetPrototypePage.homePageLink.click();
	await pageEditorPage.addWidget('Content Management', 'Web Content Display');
	await webContentDisplayPage.addWebContentWithDisplay();
	await uiElementsPage.publishButton.click();
}
