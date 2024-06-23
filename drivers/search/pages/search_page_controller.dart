import 'package:flutter/material.dart';
import 'package:kitakits/models/users/users_model.dart';
import 'package:kitakits/plugins/search/pages/search_page_event.dart';
import 'package:kitakits/plugins/search/search_storage.dart';

class SearchPageController extends SearchPageEvent {
  final String idSearch = 'idSearch';
  final String idResults = 'idResults';

  SearchPageController() {
    setInit(this);
  }

  Future<void> setKeyword() async {
    if (textEditingController == null || keyword == null) return;
    textEditingController?.text = keyword;
    textEditingController?.selection = TextSelection.collapsed(offset: textEditingController!.text.length);
    await _fillUpResults();
  }

  Future<void> _fillUpResults() async {
    places = storage.read(SearchStorage.resultsSearch);
    if (places != null) isSearching = false;
    await rebuild();
  }

  Future<void> searchAndGetResults() async {
    Users data = usersModel.data;
    String adminArea = Uri.encodeFull(data.origin['adminArea'].toLowerCase());
    String locality = Uri.encodeFull(data.origin['locality'].toLowerCase());
    String keywordEncoded = '$adminArea|$locality|${Uri.encodeFull(keyword.toLowerCase())}';
    isSearching = true;
    await rebuild();
    await placeService.findByKeyword(keywordEncoded, callback: (dynamic placeList) async {
      places = placeList;
      if (places != null) {
        isSearching = false;
        await storage.write(SearchStorage.resultsSearch, places);
        await _update();
      }
    });
  }

  Future<void> rebuild() async => update([idSearch]);
  Future<void> _update() async {
    update([idSearch]);
    update([idResults]);
  }
}
