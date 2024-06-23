class MessagesConfigs {
  Map<String, dynamic> _remote = {};

  MessagesConfigs({required Map<String, dynamic> remoteConfigs}) {
    _remote = remoteConfigs;
    _setConfigs();
  }

  Future<void> _setConfigs() async {}
}
