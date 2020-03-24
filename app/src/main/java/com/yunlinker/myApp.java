package com.yunlinker;

import android.app.Application;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;

import com.baidu.mapapi.CoordType;
import com.baidu.mapapi.SDKInitializer;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.SimpleTarget;
import com.bumptech.glide.request.transition.Transition;
import com.kongzue.dialog.util.BaseDialog;
import com.kongzue.dialog.util.DialogSettings;
import com.kongzue.dialog.util.TextInfo;
import com.qiyukf.unicorn.api.ImageLoaderListener;
import com.qiyukf.unicorn.api.SavePowerConfig;
import com.qiyukf.unicorn.api.StatusBarNotificationConfig;
import com.qiyukf.unicorn.api.UICustomization;
import com.qiyukf.unicorn.api.Unicorn;
import com.qiyukf.unicorn.api.UnicornImageLoader;
import com.qiyukf.unicorn.api.UnreadCountChangeListener;
import com.qiyukf.unicorn.api.YSFOptions;
import com.squareup.leakcanary.LeakCanary;
import com.umeng.analytics.MobclickAgent;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.PushAgent;
import com.umeng.message.UmengMessageHandler;
import com.umeng.message.UmengNotificationClickHandler;
import com.umeng.message.entity.UMessage;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;
import com.yunlinker.baseclass.BaseActivity;

import com.yunlinker.gdbs.MainActivity;
import com.yunlinker.gdbs.R;
import com.yunlinker.manager.ActivityManager;

import org.json.JSONObject;
import org.xutils.x;

import cn.bingoogolapple.qrcode.core.BGAQRCodeUtil;

import static com.yunlinker.config.WebConfig.QQID;
import static com.yunlinker.config.WebConfig.QQSECRET;
import static com.yunlinker.config.WebConfig.QYSECRET;
import static com.yunlinker.config.WebConfig.UMKEY;
import static com.yunlinker.config.WebConfig.WXID;
import static com.yunlinker.config.WebConfig.WXSECRET;
import static com.yunlinker.config.WebConfig.saveKey;

//import android.support.multidex.MultiDex;
//import com.yunlinker.image.GlideApp;

/**
 * Created by lemon on 2017/8/21.
 */

public class myApp extends Application {
 private Context mContext;
    private static Handler mainHandler;
    private Handler mHandler = new Handler();
    public static void setMainhandler(Handler handler){
        mainHandler=handler;
    }
    private static myApp sInstance;
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        //UMConfigure.init(this, UMConfigure.DEVICE_TYPE_PHONE, "68a3b02d047c307f90442f712bcf4a6c");
        SDKInitializer.initialize(this);
        SDKInitializer.setCoordType(CoordType.GCJ02);
        SDKInitializer.getCoordType();
        UMConfigure.init(this, "5d8070f70cafb2a8a90003dc", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, "a93e1e605079683a7fa4a6f451ce0f5f");
        UMConfigure.setLogEnabled(false);
        UMConfigure.setEncryptEnabled(false);
        initUmeng();
        UMShareAPI.get(this);
        BGAQRCodeUtil.setDebug(true);

        if (LeakCanary.isInAnalyzerProcess(this)) {
            // This process is dedicated to LeakCanary for heap analysis.
            // You should not init your app in this process.
            return;
        }
        LeakCanary.install(this);
        LeakCanary.install(this);

        DialogSettings.style = DialogSettings.STYLE.STYLE_IOS;
        DialogSettings.DEBUGMODE = true;
        DialogSettings.isUseBlur = true;
        DialogSettings.theme = DialogSettings.THEME.LIGHT;
        DialogSettings.buttonTextInfo =
                new TextInfo().setFontColor(getResources().getColor(R.color.color_quxiao));
        DialogSettings.buttonPositiveTextInfo =
                new TextInfo().setFontColor(getResources().getColor(R.color.color_quedin));
        x.Ext.init(this);
       // x.Ext.setDebug(BuildConfig.DEBUG);
        startApp();
    }


    public void startApp(){
        SharedPreferences sp = getSharedPreferences(saveKey, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("startApp", "1");
        editor.commit();
    }


    @Override
    public void onTerminate() {
        BaseDialog.unload();
        super.onTerminate();
    }


    private void initUmeng() {

        MobclickAgent.startWithConfigure(new MobclickAgent.UMAnalyticsConfig(getApplicationContext(),UMKEY,"OnlineApp"));

        final PushAgent mPushAgent = PushAgent.getInstance(this);
        
        //注册推送服务，每次调用register方法都会回调该接口
        mPushAgent.register(new IUmengRegisterCallback() {

            @Override
            public void onSuccess(String deviceToken) {
                //注册成功会返回device token
                Log.e("deviceToken", deviceToken);
                if(deviceToken!=null) {
                    SharedPreferences sp = getApplicationContext().getSharedPreferences(saveKey, Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sp.edit();
                    editor.putString("deviceToken", deviceToken);
                    editor.apply();
                }
            }

            @Override
            public void onFailure(String s, String s1) {

            }
        });
        UmengNotificationClickHandler notificationClickHandler = new UmengNotificationClickHandler(){
            @Override
            public void dealWithCustomAction(Context context, UMessage msg) {
                super.dealWithCustomAction(context, msg);

                Log.e("UMessage", "dealWithCustomAction: "+msg.custom);
                try{
                    JSONObject object =new JSONObject(msg.custom);
                    String type = object.getString("messType");
                    String id = object.getString("messId");
                    String url="";
                    if (type!=null&&id!=null){
                        url = "newsList.html?id="+id+"&type="+type;
                    }
                    if (mainHandler!=null){
                        mainHandler.obtainMessage(BaseActivity.openNewDetali,url).sendToTarget();
                    }


                }catch (Exception e){
                    Log.e("Exception", "dealWithCustomAction: "+e);
                }
            }
        };
        mPushAgent.setNotificationClickHandler(notificationClickHandler);

        UmengMessageHandler messageHandler = new UmengMessageHandler(){
            @Override
            public Notification getNotification(Context context, UMessage uMessage) {
                Log.e("1111111", "getNotification: "+uMessage.extra);
                if (Build.VERSION.SDK_INT > Build.VERSION_CODES.N_MR1) {
                    NotificationChannel channel = new NotificationChannel("badge", "badge",
                            NotificationManager.IMPORTANCE_HIGH);
                    channel.setShowBadge(true);
                    NotificationManager notificationManager = (NotificationManager) getSystemService(
                            NOTIFICATION_SERVICE);
                    notificationManager.createNotificationChannel(channel);
                }
                return super.getNotification(context, uMessage);
            }
        };
        mPushAgent.setMessageHandler(messageHandler);


        new Thread(new Runnable() {
            @Override
            public void run() {
            }


        }).start();




    }

    {
        //设置Log开关
        UMConfigure.setLogEnabled(false);
        PlatformConfig.setWeixin(WXID, WXSECRET);
        PlatformConfig.setQQZone(QQID, QQSECRET);
    }



    static public boolean checkUpdate = false;


    private void initQiyu() {
        //----qiyu---
        Unicorn.init(this, QYSECRET, options(), new UnicornImageLoader(){
            @Override
            public Bitmap loadImageSync(String uri, int width, int height) {
                return null;
            }
            @Override
            public void loadImage(String uri, int width, int height, final ImageLoaderListener listener) {
                if(!TextUtils.isEmpty(uri)){}
                    Glide.with(getApplicationContext()).asBitmap().load(uri).into(new SimpleTarget<Bitmap>() {
                        @Override
                        public void onResourceReady(Bitmap resource, Transition<? super Bitmap> transition) {
                            listener.onLoadComplete(resource);
                        }
                    });
            }
        });

        Unicorn.addUnreadCountChangeListener(new UnreadCountChangeListener() {
            @Override
            public void onUnreadCountChange(int count) {
                BaseActivity a = ActivityManager.getInstance().getFirst();
                if(a!=null) {
                    a.getWebView().loadUrl("javascript:qiyuMsgCount&&qiyuMsgCount("+count+")");
                }
            }
        }, true);
    }

    //----qiyu---如果返回值为null，则全部使用默认参数。
    public static YSFOptions options() {
        YSFOptions options = new YSFOptions();
        options.statusBarNotificationConfig = new StatusBarNotificationConfig();
        options.statusBarNotificationConfig.notificationEntrance = MainActivity.class;
        options.savePowerConfig = new SavePowerConfig();
        options.uiCustomization = new UICustomization();
        options.uiCustomization.leftAvatar = "";
        return options;
    }

    public static myApp getInstance() {
        return sInstance;
    }
    public Handler getHandler() {
        return mHandler;
    }
    

}
