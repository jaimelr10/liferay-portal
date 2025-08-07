/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FeatureFlagsOptions} from '../../../../fixtures/featureFlagsTest';
import {ApplicationPage} from '../pages/ApplicationPage';
import { EndpointPage } from '../pages/EndpointPage';
import {HeadlessBuilderPage} from '../pages/HeadlessBuilderPage';
import {SchemaPage} from '../pages/SchemaPage';
import {headlessBuilderTest} from './headlessBuilderTest';

const headlessBuilderPagesTest = (featureFlags?: FeatureFlagsOptions) =>
	headlessBuilderTest(featureFlags).extend<{
		applicationPage: ApplicationPage;
		headlessBuilderPage: HeadlessBuilderPage;
		schemaPage: SchemaPage;
		endpointPage: EndpointPage;
	}>({
		applicationPage: async ({page}, use) => {
			await use(new ApplicationPage(page));
		},
		endpointPage: async ({page}, use) => {
			await use(new EndpointPage(page));
		},
		headlessBuilderPage: async ({page}, use) => {
			await use(new HeadlessBuilderPage(page));
		},
		schemaPage: async ({page}, use) => {
			await use(new SchemaPage(page));
		},
	});

export {headlessBuilderPagesTest};
