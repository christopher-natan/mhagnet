import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/search/pages/search_page_controller.dart';
import 'package:kitakits/plugins/search/search_routes.dart';
import 'package:kitakits/plugins/search/widgets/search_widget_event.dart';
import 'package:kitakits/utils/app_util.dart';

enum SearchStatus { show, hide, none }

enum SearchState { expanded, collapse, none }

class SearchWidgetController extends SearchWidgetEvent {
  final String idSearch = 'idSearch';

  SearchWidgetController() {
    setInit(this);
  }

  Future<void> setStatus({required SearchStatus status, int durationMs = 300}) async {
    Future.delayed(Duration(milliseconds: durationMs), () async {
      this.status = status;
      await rebuild();
    });
  }

  Future<void> setState({required SearchState searchState, int durationMs = 300, Function? callback}) async {
    Future.delayed(Duration(milliseconds: durationMs), () async {
      state = searchState;
      await rebuild();
      if (callback != null) callback();
    });
  }

  Future<void> open({Function? callback}) async {
    await setStatus(status: SearchStatus.show, durationMs: durationMs);
    await setState(searchState: SearchState.expanded, durationMs: 1000);
    await callback!();
  }

  Future<void> close() async {
    await setState(searchState: SearchState.collapse, durationMs: 200, callback: () => _hide());
  }

  Future<void> _hide() async {
    await setStatus(status: SearchStatus.hide);
    Future.delayed(const Duration(milliseconds: 300), () async {
      await setStatus(status: SearchStatus.none);
    });
  }

  Future<void> setStateOnCollapse() async {
    if (textEditingController!.text.isNotEmpty) return;
    if (state == SearchState.collapse) {
      await setState(searchState: SearchState.expanded, durationMs: 300);
      Future.delayed(const Duration(seconds: 1), () async {
        FocusScope.of(Get.context!).requestFocus(focusNode);
        await clearText();
      });
    } else {
      await clearText();
    }
  }

  Future<void> clearText() async {
    textEditingController!.text = '';
    await rebuild();
  }

  Future<void> setFocus() async {
    Future.delayed(const Duration(seconds: 1), () => state == SearchState.expanded ? FocusScope.of(Get.context!).requestFocus(focusNode) : {});
  }

  Future<void> collapse() async {
    if (state == SearchState.expanded) {
      await setState(searchState: SearchState.collapse);
    }
  }

  Future<void> navigateToSearch(String keyword) async {
    if (keyword.length < minKeyword) return;
    Get.put(SearchPageController());
    searchService.keyword = keyword;
    await set(searchService.onFilledUpKeyword);
    Get.toNamed(SearchRoutes.searchPage)?.then((_) async {
      await clearText();
      await collapse();
      await AppUtil.setFullScreen();
    });
  }

  Future<void> rebuild() async => update([idSearch]);
}
