import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/search/pages/search_page_controller.dart';
import 'package:kitakits/plugins/search/search.dart';
import 'package:kitakits/plugins/search/widgets/search_widget_controller.dart' as s;
import 'package:kitakits/plugins/search/widgets/search_widget_controller.dart';
import 'package:kitakits/utils/app_util.dart';

class SearchWidgetEvent extends Search {
  late s.SearchWidgetController _controller;
  late SearchPageController lookupPageController = Get.find();
  final TextEditingController? textEditingController = TextEditingController();
  final FocusNode? focusNode = FocusNode();
  final int durationMs = 500;
  SearchStatus status = SearchStatus.none;
  s.SearchState state = s.SearchState.collapse;
  bool isAutoFocus = false;
  int minKeyword = 3;
  String name = '::SearchWidgetEvent';

  Future<void> setInit(s.SearchWidgetController controller) async {
    _controller = controller;
    await setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _withPanelWidgetController();
    await _withMapPageController();
    await _withPositionService();
  }

  Future<void> _withPanelWidgetController() async {
    await on(panelWidgetService.onShow, () async {
      pr(name, 'panelWidgetService.onShow');
      await _controller.setStatus(status: s.SearchStatus.show);
      await _controller.open(callback: () async {
        await set(searchService.onShow);
      });
    }, priority: 3);
  }

  Future<void> _withMapPageController() async {
    await on(mapPageCreateService.onEventCreationCanceled, () async {
      pr(name, 'mapPageCreateService.onEventCreationCanceled');
      _controller.close();
    }, priority: 1);

    await on(mapPageCreateService.onJoinsStarted, () async {
      pr(name, 'mapPageCreateService.onJoinsStarted');
      _controller.close();
    }, priority: 1);

    await on(gmapController.onMapTap, () async {
      pr(name, 'gmapController.onMapTap');
      if (state == SearchState.expanded && textEditingController!.text.isEmpty) {
        await _controller.collapse();
      }
      await AppUtil.setFullScreen();
    });
  }

  Future<void> onChangedSearch(String keyword) async => await _controller.navigateToSearch(keyword.trim());
  Future<void> onPressedKeywordText() async {
    await _controller.setStateOnCollapse();
  }

  Future<void> _withPositionService() async {
    await on(travelsService.onStoppedPositionListen, () async {
      pr(name, 'travelsService.onStoppedPositionListen');
      _controller.close();
    });
  }
}
