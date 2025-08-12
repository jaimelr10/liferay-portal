/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {dataRemoteApiHelpersTest} from '../../../fixtures/dataRemoteApiHelpersTest';
import {featureFlagsTest} from '../../../fixtures/featureFlagsTest';
import {loginTest} from '../../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../../fixtures/pageEditorPagesTest';
import {pageViewModePagesTest} from '../../../fixtures/pageViewModePagesTest';
import {pagesAdminPagesTest} from '../../../fixtures/pagesAdminPagesTest';
import {productMenuPageTest} from '../../../fixtures/productMenuPageTest';
import {remotePageTest} from '../../../fixtures/remotePageTest';
import {uiElementsPageTest} from '../../../fixtures/uiElementsTest';
import {webContentDisplayPageTest} from '../../../fixtures/webContentDisplayPageTest';
import getGlobalSiteId from '../../../utils/getGlobalSiteId';
import getRandomString from '../../../utils/getRandomString';
import {PORTLET_URLS} from '../../../utils/portletUrls';
import {pagesPagesTest} from '../../layout-admin-web/main/fixtures/pagesPagesTest';
import {remoteStagingPagesTest} from './fixtures/remoteStagingPagesTest';
import {safeTeardown} from './utils/safeTeardown';

const remotePort = '9080';
const remotePage = remotePageTest(remotePort);

export const test = mergeTests(
	dataApiHelpersTest,
	dataRemoteApiHelpersTest(remotePage, remotePort),
	loginTest(),
	featureFlagsTest({
		'LPD-39304': {enabled: true},
	}),
	pageEditorPagesTest,
	pagesAdminPagesTest,
	pagesPagesTest,
	pageViewModePagesTest,
	productMenuPageTest,
	remoteStagingPagesTest,
	uiElementsPageTest,
	webContentDisplayPageTest
);

test(
	'can publish vocabulary deletion from the Global Site using remote staging',
	{tag: ['@LPS-89981', '@LPS-88298']},
	async (
		{
			apiHelpers,
			configStagingPage,
			page,
			portletStagingPage,
			remoteApiHelpers,
			remotePage,
		},
		testInfo
	) => {
		test.slow();
			
		let vocabularyId;
		const vocabularyName = getRandomString();

		const remoteUrl = new URL(remoteApiHelpers.baseUrl);
		const remoteGlobalSiteId = await getGlobalSiteId(
			remoteApiHelpers,
			remoteUrl.origin
		);

		const globalSiteId = await getGlobalSiteId(apiHelpers);

		await test.step('Setup remote staging', async () => {
			await apiHelpers.jsonWebServicesStaging.enableRemoteStaging({
				groupId: globalSiteId,
				remoteGroupId: remoteGlobalSiteId,
				remotePort,
			});
		});

		try {
			await test.step('Create vocabulary', async () => {
				const {id} =
					await apiHelpers.headlessAdminTaxonomy.postSiteTaxonomyVocabulary(
						{
							name: vocabularyName,
							siteId: globalSiteId,
						}
					);
				apiHelpers.data.push({
					id,
					type: 'taxonomyVocabulary',
				});

				vocabularyId = id;
			});

			await test.step('Publish vocabulary and verify on remote site', async () => {
				await page.goto(`/group/global${PORTLET_URLS.categoriesAdmin}`);
				await portletStagingPage.openIframe();
				await portletStagingPage.publishToLive();

				await remotePage.goto(
					`/group/global${PORTLET_URLS.categoriesAdmin}`
				);
				await expect(
					remotePage.getByRole('menuitem', {name: vocabularyName})
				).toBeVisible();
			});

			await test.step('Delete vocabulary, publish deletion and verify removal on remote site', async () => {
				await apiHelpers.headlessAdminTaxonomy.deleteTaxonomyVocabulary(
					vocabularyId
				);

				await portletStagingPage.openIframe();

				const contentCheckbox =
					portletStagingPage.publishStagingIframe.getByLabel(
						/Content\s+\d+\s+Deletions/i
					);
				await expect(async () => {
					await expect(contentCheckbox).not.toBeChecked();
				}).toPass();
				await contentCheckbox.check();

				await portletStagingPage.publishStagingIframe
					.getByLabel('Replicate Individual')
					.check();

				await portletStagingPage.publishToLive();

				await remotePage.goto(
					`/group/global${PORTLET_URLS.categoriesAdmin}`
				);
				await expect(
					remotePage.getByRole('menuitem', {name: vocabularyName})
				).toBeHidden();
			});
		}
		finally {
			await test.step('Teardown: Disabling staging on global site', async () => {
				await safeTeardown(
					async () =>
						await configStagingPage.disableStaging('/global'),
					testInfo.timeout * 0.5
				);
			});
		}
	}
);
