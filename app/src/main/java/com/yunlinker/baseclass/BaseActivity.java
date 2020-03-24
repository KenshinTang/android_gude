package com.yunlinker.baseclass;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Rect;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GestureDetectorCompat;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.sdk.android.oss.OSS;
import com.umeng.analytics.MobclickAgent;
import com.umeng.message.PushAgent;
import com.umeng.socialize.UMShareAPI;
import com.yunlinker.auth.WebPermissionManager;

import com.yunlinker.gdbs.JSInspect;
import com.yunlinker.manager.ActivityResult;
import com.yunlinker.myApp;
import com.yunlinker.util.AndroidBugWorkaround;
import com.yunlinker.util.VirturlUtil;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import static com.yunlinker.config.WebConfig.AssestRoot;
import static com.yunlinker.config.WebConfig.UMSHARE_CALLBACK_CODE;
import static com.yunlinker.config.WebConfig.saveKey;


/**
 * Created by lemon on 2017/7/26.
 */

public class BaseActivity extends AppCompatActivity implements Handler.Callback {
    private static final int REQUEST_CODE_SCAN = 0x0000;
    public static  String tempcode;
    public Uri mImageUri,mSmallUri;
    public String loadUrl;
    private OSS oss;

    protected BaseWebView mwebView;
    private ImageView splash;
    public BaseWebView getWebView() {
        return mwebView;
    }

  //  public RelativeLayout rootlay;
    public LinearLayout rootlay;


    /**
     * 录音数队列
     */
    private ConcurrentLinkedQueue<byte[]> audioQueue = new ConcurrentLinkedQueue<byte[]>();
    public ThreadPoolExecutor mExecutor = new ThreadPoolExecutor(2, 2, 60, TimeUnit.SECONDS,
            new LinkedBlockingQueue<Runnable>());

    public AudioTrack mAudioTrack;
    public AudioRecord mAudioRecord;
    public int mRecorderBufferSize;
    public byte[] mAudioData;

    /*默认数据*/
    public int mSampleRateInHZ = 8000; //采样率
    public int mAudioFormat = AudioFormat.ENCODING_PCM_16BIT;  //位数
    public int mChannelConfig = AudioFormat.CHANNEL_IN_MONO;   //声道
    public GestureDetectorCompat gestureDetector;
    public boolean isSingleTap = false;
    public LinearLayout.LayoutParams webLayoutParams;
    public static final int openNewDetali=100;
    private Handler handler;
    //private boolean isTest = true;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        }
        this.getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        rootlay = new LinearLayout(this);
        setContentView(rootlay);
        //解决键盘挡住网页输入框
        AndroidBugWorkaround.assistActivity(this);
        //解决虚拟键盘挡住导航栏
        VirturlUtil.assistActivity(rootlay);
        addWebView();
        //录音
        //initData();
        setStatusBarLightMode();

        setTranslucentKeepVirtualNav(this);
        setAndroidNativeLightStatusBar(this, true);

        gestureDetector = new GestureDetectorCompat(this, new GestureDetector());

        //推送消息点击跳转的handler
        handler = new Handler(this);
        myApp.setMainhandler(handler);
        PushAgent.getInstance(this).onAppStart();


    }


    /**
     * 华为手机状态栏设置
     * @param activity
     */
    public static void setTranslucentKeepVirtualNav(Activity activity) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            return;
        }
        Window window = activity.getWindow();
        window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(0x00000000);  // transparent
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            int flags = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
            window.addFlags(flags);
        }

    }

    /**
     * 手机状态栏字体颜色
     * @param activity
     * @param dark
     */
    private static void setAndroidNativeLightStatusBar(Activity activity, boolean dark) {
        View decor = activity.getWindow().getDecorView();
        if (dark) {
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        } else {
            decor.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    /**
     * 小米手机设置状态栏字体颜色为黑色
     */
    private void setStatusBarLightMode() {
        if (this.getWindow() != null) {
            Class clazz = this.getWindow().getClass();
            try {
                int darkModeFlag = 0;
                Class layoutParams = Class.forName("android.view.MiuiWindowManager$LayoutParams");
                Field field = layoutParams.getField("EXTRA_FLAG_STATUS_BAR_DARK_MODE");
                darkModeFlag = field.getInt(layoutParams);
                Method extraFlagField = clazz.getMethod("setExtraFlags", int.class, int.class);
                extraFlagField.invoke(this.getWindow(), darkModeFlag, darkModeFlag);//状态栏透明且黑色字体
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    /**
     *  录音
     */
    private void initData() {
        mRecorderBufferSize = AudioRecord.getMinBufferSize(mSampleRateInHZ, mChannelConfig, mAudioFormat);
        mAudioData = new byte[320];
        mAudioRecord = new AudioRecord(MediaRecorder.AudioSource.VOICE_COMMUNICATION, mSampleRateInHZ, mChannelConfig, mAudioFormat, mRecorderBufferSize);
    }

    public void showToast(String content) {
        Toast.makeText(this, content, Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onStart() {
        super.onStart();
        //testJS();
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);

        if(mwebView!=null)
            mwebView.resumeWeb();
    }

    public AlertDialog dialog;
    @Override
    protected void onPause() {
        super.onPause();
        if(dialog!=null) dialog.dismiss();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mwebView != null) {
            mwebView.destroy();
        }
        MobclickAgent.onPause(this);
    }



    @Override
    public Resources getResources() {
        Resources res = super.getResources();
        Configuration config=new Configuration();
        config.setToDefaults();
        res.updateConfiguration(config,res.getDisplayMetrics());
        return res;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode,  Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode,resultCode,data);
        if(requestCode==UMSHARE_CALLBACK_CODE) {

        } else {
            ActivityResult.getInstance().resultBack(BaseActivity.this, requestCode, resultCode, data);
        }
        if(requestCode==REQUEST_CODE_SCAN&&resultCode==RESULT_OK) {
            if (data != null) {
                String result = data.getStringExtra("codedContent");
                mwebView.setInsCode("scanf", tempcode);
                mwebView.setValue("scanf", result);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        WebPermissionManager.getInstance(BaseActivity.this).authBack(requestCode, permissions, grantResults);
    }

    @Override
    public void onBackPressed() {
        mwebView.setValue("0", "back");
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Boolean backV = true;
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:
               onBackPressed();
                break;
            case KeyEvent.KEYCODE_MENU:
                break;
            default:
                backV = super.onKeyDown(keyCode, event);
                break;
        }
        return  backV;
    }

    //添加webview
    private JSInspect inp = null;
    //获取inspect对象
    public JSInspect jsInp() {
        return inp;
    }
    //添加视图
    protected void addWebView() {
        mwebView = new BaseWebView(this);

        webLayoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);

        mwebView.setLayoutParams(webLayoutParams);
        rootlay.addView(mwebView);


        inp = new JSInspect(mwebView, BaseActivity.this);

        mwebView.addJavascriptInterface(inp, "WeiLai");

        mwebView.setWebViewClient(new BaseClient(mwebView, BaseActivity.this));

        mwebView.setWebContentsDebuggingEnabled(true);

        mwebView.requestFocus();

        WebSettings setting = mwebView.getSettings();
        setting.setJavaScriptEnabled(true);//支持js
        setting.setDefaultTextEncodingName("utf-8");
        setting.setDomStorageEnabled(true);
        setting.setAllowFileAccess(true);
        setting.setAllowContentAccess(true);
        setting.setAllowFileAccessFromFileURLs(true);
        setting.setCacheMode(WebSettings.LOAD_DEFAULT);
        setting.setNeedInitialFocus(true);
        setting.setUseWideViewPort(true);
        setting.setJavaScriptCanOpenWindowsAutomatically(true);
        setting.setLoadWithOverviewMode(true);
        setting.setGeolocationEnabled(true);

        //自适应屏幕
        setting.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);

        mwebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        mwebView.setHorizontalScrollBarEnabled(false);//水平不显示
        mwebView.setVerticalScrollBarEnabled(true); //垂直不显示
        /* 指定垂直滚动条是否有叠加样式 */
        mwebView.setVerticalScrollbarOverlay(true);
        /* 设置滚动条的样式 */
        mwebView.setScrollBarStyle(mwebView.SCROLLBARS_OUTSIDE_OVERLAY);
        mwebView.setWebChromeClient(new WebChromeClient() {

            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                //progressBar.setProgress(newProgress);
                super.onProgressChanged(view, newProgress);
            }

        });
        loadUrl = getIntent().getStringExtra("sendUrl");
        if (!TextUtils.isEmpty(loadUrl)) {
            if(!loadUrl.startsWith("http") || !loadUrl.startsWith("file"))
             loadUrl = AssestRoot+loadUrl;
            mwebView.loadUrl(loadUrl);
        } else {
            //首页
            mwebView.loadUrl(AssestRoot + "index.html");
        }
        setKeyBoard();


    }




    private int screenHeight=0;
    private void setKeyBoard() {
        //---------------安卓键盘处理-----------------
        mwebView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect r = new Rect();
                mwebView.getWindowVisibleDisplayFrame(r);
                final int visibleHeight = r.height();
                if(screenHeight==0) {
                    screenHeight = visibleHeight;
                } else {
                    if(visibleHeight>100 && screenHeight!=visibleHeight) {
                        //有可能为打开键盘
                        mwebView.post(new Runnable() {
                            @Override
                            public void run() {
                                float ratio = (screenHeight-visibleHeight)/(float)screenHeight;
                                mwebView.loadUrl("javascript:window.keyBoardEvent&&keyBoardEvent(1,"+ratio+");");
                            }
                        });
                    } else {
                        //有可能为关闭键盘
                        mwebView.post(new Runnable() {
                            @Override
                            public void run() {
                                mwebView.loadUrl("javascript:window.keyBoardEvent&&keyBoardEvent(0);");
                            }
                        });
                    }
                }
            }
        });
    }

    private class GestureDetector extends android.view.GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onSingleTapUp(MotionEvent e) {
            isSingleTap = true;
            return false;
        }
        @Override
        public boolean onSingleTapConfirmed(MotionEvent e) {
            isSingleTap = true;
            return false;
        }
    }


    @Override
    public boolean handleMessage(Message msg) {
        switch (msg.what) {
            case openNewDetali:
                inp.go(msg.obj.toString());
                break;
        }
        return false;
    }



}
