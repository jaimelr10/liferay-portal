/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.exportimport.web.internal.portlet.action;

import com.liferay.exportimport.constants.ExportImportPortletKeys;
import com.liferay.exportimport.rest.resource.v1_0.ExportPreviewResource;
import com.liferay.exportimport.web.internal.constants.ExportImportWebKeys;
import com.liferay.exportimport.web.internal.display.context.ExportImportPreviewDisplayContext;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCRenderCommand;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.staging.StagingGroupHelper;

import jakarta.portlet.RenderRequest;
import jakarta.portlet.RenderResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Jaime Leon
 */
@Component(
	property = {
		"jakarta.portlet.name=" + ExportImportPortletKeys.COMPANY_EXPORT,
		"jakarta.portlet.name=" + ExportImportPortletKeys.EXPORT,
		"mvc.command.name=/export_import/view_new_export"
	},
	service = MVCRenderCommand.class
)
public class ViewNewExportMVCRenderCommand implements MVCRenderCommand {

	@Override
	public String render(
		RenderRequest renderRequest, RenderResponse renderResponse) {

		ThemeDisplay themeDisplay = (ThemeDisplay)renderRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		long groupId = ParamUtil.getLong(renderRequest, "groupId");

		renderRequest.setAttribute(
			ExportImportWebKeys.EXPORT_IMPORT_PREVIEW_DISPLAY_CONTEXT,
			new ExportImportPreviewDisplayContext(
				"/export_import/view_export_layouts",
				_exportPreviewResourceFactory,
				_portal.getHttpServletRequest(renderRequest),
				_portal.getLiferayPortletResponse(renderResponse),
				_groupLocalService.fetchGroup(groupId), groupId,
				ParamUtil.getLong(renderRequest, "liveGroupId", groupId),
				ParamUtil.getBoolean(renderRequest, "privateLayout"),
				_stagingGroupHelper, themeDisplay));

		return "/revamp/export/new_export.jsp";
	}

	@Reference
	private ExportPreviewResource.Factory _exportPreviewResourceFactory;

	@Reference
	private GroupLocalService _groupLocalService;

	@Reference
	private Portal _portal;

	@Reference
	private StagingGroupHelper _stagingGroupHelper;

}