/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

import {ApplicationsMenuPage} from '../product-navigation-applications-menu/ApplicationsMenuPage';

export class HeadlessBuilderPage {
	readonly applicationsMenuPage: ApplicationsMenuPage;
	readonly page: Page;
	readonly addNewApiApplicationButton: Locator;

	constructor(page: Page) {
		this.applicationsMenuPage = new ApplicationsMenuPage(page);
		this.page = page;
		this.addNewApiApplicationButton = page.getByRole('button', {
			name: 'New',
		});
	}

	async goto() {
		await this.applicationsMenuPage.goToApiBuilder();
	}

	async goToEditApiApplication(apiApplicationName: string) {
		await this.page.getByRole('link', {name: apiApplicationName}).click();
	}
}
