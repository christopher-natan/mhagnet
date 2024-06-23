import 'dart:math' as math;

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animator/flutter_animator.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:get/get.dart';
import 'package:kitakits/plugins/messages/models/messages_model.dart';
import 'package:kitakits/plugins/messages/pages/messages_page_controller.dart';
import 'package:kitakits/plugins/widgets/custom/text_widget.dart';
import 'package:kitakits/strings.dart';
import 'package:kitakits/styles.dart';
import 'package:kitakits/utils/app_util.dart';
import 'package:timeago/timeago.dart' as timeago;

class MessagesPage extends GetResponsiveView<MessagesPageController> {
  MessagesPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GetBuilder<MessagesPageController>(
        id: controller.idMessages,
        builder: (instance) {
          return Scaffold(backgroundColor: Colors.white, body: SafeArea(child: Stack(children: [_buildContainer(instance), _buildHeader(instance)])));
        });
  }

  Widget _buildContainer(MessagesPageController instance) {
    Widget animationWidget = instance.messagesModel.list.isNotEmpty
        ? Positioned(bottom: 60, child: SizedBox(width: Get.width, child: AppUtil.getLottie('chat/car_travel')))
        : Container();

    return Stack(children: [
      SingleChildScrollView(
          child: GestureDetector(
              child: AnimatedContainer(
                  margin: const EdgeInsets.only(top: 0),
                  duration: const Duration(milliseconds: 10),
                  height: Get.height,
                  width: Get.width,
                  child: Align(alignment: Alignment.topCenter, child: _buildContents(instance))),
              onTap: () => instance.onPressedPage())),
      animationWidget
    ]);
  }

  Widget _buildHeader(MessagesPageController instance) {
    return Positioned(
        top: 0,
        child: Container(
            color: Styles.lightColor().withOpacity(0.3),
            width: Get.width,
            child: Padding(
                padding: const EdgeInsets.only(top: 15, left: 10, right: 10),
                child: Row(mainAxisAlignment: MainAxisAlignment.start, crossAxisAlignment: CrossAxisAlignment.center, children: [
                  SizedBox(
                    height: 50,
                    child: InkWell(child: const Icon(CupertinoIcons.back, color: Colors.black), onTap: () => controller.onPressedBack()),
                  ),
                  const SizedBox(width: 10),
                  _buildFriend(instance)
                ]))));
  }

  Widget _buildFriend(MessagesPageController instance) {
    Map details = controller.getDetails();
    return Row(mainAxisSize: MainAxisSize.max, children: [
      Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 8, 0),
          child: ClipRRect(
              borderRadius: BorderRadius.circular(40),
              child: CachedNetworkImage(
                imageUrl: details['icon'],
                width: 32,
                height: 32,
                fit: BoxFit.cover,
              ))),
      Padding(
          padding: const EdgeInsetsDirectional.fromSTEB(4, 0, 0, 0),
          child: Column(mainAxisSize: MainAxisSize.max, mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.start, children: [
            TextWidget.s16w600(details['name']),
            Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(0, 0, 0, 0),
                child: TextWidget.s11w400(instance.getOnline(), color: Styles.primaryColor()))
          ]))
    ]);
  }

  Widget _buildContents(MessagesPageController instance) {
    List<Messages> list = instance.messagesModel.list;
    int length = instance.messagesModel.list.length;
    Widget animation = Column(
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [SizedBox(width: Get.width / 3, height: 160, child: AppUtil.getLottie('chat/message')), TextWidget.s15w400(Strings.msg("ch10"))],
    );
    return Column(children: [
      Expanded(
          flex: 1,
          child: Container(
              width: Get.width,
              height: Get.height,
              padding: const EdgeInsets.only(bottom: 20),
              decoration: const BoxDecoration(
                color: Colors.white,
              ),
              child: length <= 0
                  ? animation
                  : ListView.builder(
                      controller: instance.listViewController,
                      reverse: true,
                      padding: const EdgeInsets.only(top: 15.0),
                      itemCount: length,
                      itemBuilder: (context, index) {
                        return index >= length ? _buildAnimatedMessage(instance, list[index]) : _buildMessage(instance, list[index]);
                      }))),
      const SizedBox(height: 80),
      _buildComposer(instance),
    ]);
  }

  Widget _buildAnimatedMessage(MessagesPageController instance, Messages message) {
    return FadeIn(preferences: const AnimationPreferences(offset: Duration(milliseconds: 500)), child: _buildMessage(instance, message));
  }

  Widget _buildMessage(MessagesPageController instance, Messages data) {
    bool isUser = instance.isUser(userId: data.userId);
    return isUser ? _buildBubbleSent(data) : _buildBubbleReceived(data);
  }

  Widget _buildLike(Messages data) {
    return IconButton(
        icon: Icon(
          data.isLiked ? Icons.favorite : Icons.favorite_border_outlined,
          size: 30.0,
          color: data.isLiked ? Styles.primaryColor() : Colors.blueGrey,
        ),
        onPressed: () => controller.onPressedLike(data));
  }

  Widget _buildHeart(Messages data) {
    return data.isLiked ? const Icon(Icons.favorite, size: 25.0, color: Colors.red) : Container();
  }

  Widget _buildComposer(MessagesPageController instance) {
    Widget icon = instance.isSending
        ? const SpinKitDualRing(
            size: 20,
            color: Colors.white,
          )
        : const Icon(Icons.send);
    return Container(
        height: 60.0,
        color: Styles.primaryDarkColor(),
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Row(children: [
          IconButton(
            icon: const Icon(Icons.message),
            color: Styles.primaryColor(),
            iconSize: 25.0,
            onPressed: () {},
          ),
          Expanded(
              child: Container(
            padding: const EdgeInsets.only(top: 4),
            child: TextField(
              maxLines: 3,
              controller: instance.textEditingController,
              onChanged: (value) => instance.onChangedMessage(value),
              //textCapitalization: TextCapitalization.sentences,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
              decoration: InputDecoration(
                  hintText: "Send a message ...",
                  border: InputBorder.none,
                  counter: const Offstage(),
                  hintStyle: TextStyle(
                    color: Colors.white.withOpacity(0.4),
                    fontWeight: FontWeight.normal,
                  )),
              maxLength: 200,
            ),
          )),
          IconButton(
            icon: icon,
            color: Styles.primaryColor(),
            iconSize: 25.0,
            onPressed: instance.isSending || instance.guestService.friendLeft ? null : instance.onPressedSend,
          )
        ]));
  }

  Widget _buildBubbleSent(Messages data) {
    final messageTextGroup = Flexible(
        child: Row(
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Flexible(
            child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Styles.secondaryColor(),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(18),
                    bottomLeft: Radius.circular(18),
                    bottomRight: Radius.circular(18),
                  ),
                ),
                child: TextWidget.s15w400(data.message, color: Styles.lightColor()))),
        CustomPaint(painter: Triangle(Styles.secondaryColor())),
      ],
    ));

    Widget message = Padding(
      padding: const EdgeInsets.only(right: 18.0, left: 50, top: 5, bottom: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[const SizedBox(height: 30), messageTextGroup],
      ),
    );

    Widget stack = Stack(
      children: [
        message,
        Positioned(bottom: 0, right: 10, child: _buildHeart(data)),
      ],
    );
    return Column(children: [
      stack,
      Align(
        alignment: Alignment.bottomRight,
        child: Container(
            height: 13,
            width: 100,
            margin: const EdgeInsets.only(right: 15),
            child: TextWidget.s11w400(timeago.format(AppUtil.getTimestampToDate(data.created!)), textAlign: TextAlign.right, color: Colors.black)),
      )
    ]);
  }

  Widget _buildBubbleReceived(Messages data) {
    final messageTextGroup = Flexible(
        child: Row(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Transform(
          alignment: Alignment.center,
          transform: Matrix4.rotationY(math.pi),
          child: CustomPaint(
            painter: Triangle(Colors.grey[300]!),
          ),
        ),
        Flexible(
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(18),
                bottomLeft: Radius.circular(18),
                bottomRight: Radius.circular(18),
              ),
            ),
            child: TextWidget.s15w400(data.message, color: Styles.darkColor()),
          ),
        ),
        _buildLike(data)
      ],
    ));

    return Padding(
      padding: const EdgeInsets.only(right: 50.0, left: 18, top: 5, bottom: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          const SizedBox(height: 30),
          messageTextGroup,
        ],
      ),
    );
  }
}

class Triangle extends CustomPainter {
  final Color bgColor;

  Triangle(this.bgColor);

  @override
  void paint(Canvas canvas, Size size) {
    var paint = Paint()..color = bgColor;

    var path = Path();
    path.lineTo(-5, 0);
    path.lineTo(0, 10);
    path.lineTo(5, 0);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}
