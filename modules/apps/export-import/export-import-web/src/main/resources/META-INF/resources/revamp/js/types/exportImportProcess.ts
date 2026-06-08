/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Range} from '../components/date_filter';
import {RequestPortletDataHandler} from './portletDataHandler';

export interface ExportProcess {
	dateCreated?: string;
	dateModified?: string;
	id?: number;
	name?: string;
	status?: {code: number; label: string};
}

export interface ExportProcessRequest {
	deletions?: boolean;
	endDate?: string;
	last?: number;
	name: string;
	permissions?: boolean;
	range?: Range;
	requestPortletDataHandlers?: RequestPortletDataHandler[];
	startDate?: string;
}

export const DATA_STRATEGIES = {
	MIRROR: 'MIRROR',
	MIRROR_OVERWRITE: 'MIRROR_OVERWRITE',
} as const;

export type DataStrategy =
	(typeof DATA_STRATEGIES)[keyof typeof DATA_STRATEGIES];

export const USER_ID_STRATEGIES = {
	ALWAYS_CURRENT_USER_ID: 'ALWAYS_CURRENT_USER_ID',
	CURRENT_USER_ID: 'CURRENT_USER_ID',
} as const;

export type UserIdStrategy =
	(typeof USER_ID_STRATEGIES)[keyof typeof USER_ID_STRATEGIES];

export interface ImportProcess {
	dateCreated?: string;
	dateModified?: string;
	id?: number;
	name?: string;
	status?: {code: number; label: string};
}

export interface ImportProcessRequest {
	dataStrategy?: DataStrategy;
	deletions?: boolean;
	name?: string;
	permissions?: boolean;
	requestPortletDataHandlers?: RequestPortletDataHandler[];
	userIdStrategy?: UserIdStrategy;
}
