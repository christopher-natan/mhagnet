import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/search/pages/search_page_controller.dart';
import 'package:kitakits/plugins/search/search.dart';
import 'package:kitakits/utils/app_util.dart';

class SearchPageEvent extends Search {
  late SearchPageController _controller;
  final TextEditingController? textEditingController = TextEditingController();
  final FocusNode? focusNode = FocusNode();
  int minKeyword = 3;
  String keyword = '';
  bool isEnabled = true;
  bool isSearching = true;
  bool isAutofocus = true;
  dynamic places;
  String name = '::SearchPageEvent';

  Future<void> setInit(SearchPageController controller) async {
    _controller = controller;
    await setPluginName(name);
  }

  @override
  Future<void> onInit() async {
    pr(name, 'onInit()');
    super.onInit();
    await _onSearchService();
  }

  Future<void> _onSearchService() async {
    await on(searchService.onFilledUpKeyword, () async {
      pr(name, 'searchService.onFilledUpKeyword');
      keyword = searchService.keyword;
      await _controller.setKeyword();
    });
  }

  Future<void> onChangedSearch(String keyword) async {
    isSearching = false;
    if (keyword.trim().isEmpty) return;
    this.keyword = keyword;
    isSearching = true;
    if (keyword.length <= minKeyword) {
      places = null;
      return await _controller.rebuild();
    }
    await _controller.searchAndGetResults();
  }

  Future<void> onPressedResult(Map place) async {
    Future.delayed(const Duration(milliseconds: 100), () async {
      Get.back();
      focusNode?.unfocus();
      await onPressedPage();
      travelsService.getPlaceAddress()['addressLine'] = place['name'] ?? place['formatted_address'];
      await usersModel.setDestination(place, isSet: true);
    });
  }

  Future<void> onPressedPage() async {
    await AppUtil.setKeyboardHidden();
    await AppUtil.setFullScreen();
  }

  Future<void> onClickBackButton() async {
    Get.back();
  }
}
