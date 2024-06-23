import 'package:get_storage/get_storage.dart';

class MessagesStorage {
  static final GetStorage _storage = GetStorage();
  static String unreadLastCreated = 'unreadLastCreated';

  static clearPersisted()  async {
    if (_storage.read(unreadLastCreated) == null) await _storage.write(unreadLastCreated, 0);
  }
}
