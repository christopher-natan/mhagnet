class SearchConfigs {
  Map<String, dynamic> _remote = {};

  SearchConfigs({required Map<String, dynamic> remoteConfigs}) {
    _remote = remoteConfigs;
    _setConfigs();
  }

  Future<void> _setConfigs() async {}
}
