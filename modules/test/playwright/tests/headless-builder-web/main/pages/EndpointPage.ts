/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page} from '@playwright/test';

export class EndpointPage {
	readonly page: Page;
	readonly endpointSuccessAlert: Locator;
	readonly endpointName: (endpointName: string) => Promise<Locator>;
	readonly scopeSelector: (scope: 'Company' | 'Site') => Promise<Locator>;


	constructor(page: Page) {
		this.page = page;
		this.endpointSuccessAlert = page.getByText(
				'Success:New API application endpoint was created.'
			);
		this.endpointName = async (endpointName: string) => {
			return this.page.getByRole('link', { name: endpointName });
		};
		this.scopeSelector = async (scope: 'Company' | 'Site') => {
			return this.page.getByLabel(`Scope ${scope} is selected.`);
		};
	}

	async goTo(schemaName: string) {
		await this.page.getByRole('link', {name: schemaName}).click();
	}
}
