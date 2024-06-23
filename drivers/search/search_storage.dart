import 'package:get_storage/get_storage.dart';

class SearchStorage {
  static final GetStorage _storage = GetStorage();
  static String keywordSearch = 'keywordSearch';
  static String resultsSearch = 'resultsSearch';

  static clearPersisted() async {
    _storage.remove(keywordSearch);
    _storage.remove(resultsSearch);
  }
}
