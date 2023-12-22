/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
import {expect, mergeTests} from '@playwright/test';

import {test as dataMigrationCenterTest} from '../../fixtures/dataMigrationCenterPages.fixture';

export const test = mergeTests(
	dataMigrationCenterTest,
);

test('Can export specific fields in site scope objectEntry with CSV file', async ({_dataMigrationCenterPage}) => {
   await _dataMigrationCenterPage.goto();

   

});
