package com.yunlinker.baseclass;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import com.kongzue.dialog.interfaces.OnDialogButtonClickListener;
import com.kongzue.dialog.util.BaseDialog;
import com.kongzue.dialog.v3.MessageDialog;
import com.umeng.commonsdk.debug.I;
import com.yunlinker.gdbs.MainActivity;
import com.yunlinker.gdbs.MapviewActivity;
import com.yunlinker.gdbs.TestScanActivity;
import com.yunlinker.manager.ActivityManager;
import com.yunlinker.upimage.UpImger;

import org.json.JSONException;
import org.json.JSONObject;

import static com.yunlinker.config.WebConfig.AssestRoot;
import static com.yunlinker.config.WebConfig.saveKey;

/**
 * Created by lemon on 2017/7/27.
 */

public class BaseInspect {

    protected BaseActivity mactivity;
    protected BaseWebView mweb;
    private static final int REQUEST_CODE_SCAN = 0x0000;
    private static String lng,lat,addr;
    public BaseInspect(BaseWebView w, BaseActivity a) {
        this.mactivity = a;
        this.mweb = w;

    }

    //打开控制器
    @JavascriptInterface
    public void go(final String url) {
        ActivityManager.getInstance().start(url);
    }

    //关闭控制器
    @JavascriptInterface
    public void close(String count) {
       int  c = Integer.parseInt(count);
        if(c<1)
            c=1;
        ActivityManager.getInstance().back(c);
    }

    @JavascriptInterface
    public void gotop(String url){
        if(TextUtils.isEmpty(url)){
            ActivityManager.getInstance().finishButFirst();
        }else{
            ActivityManager.getInstance().finishButTop();
            if(!url.contains("http:"))
                url = AssestRoot+url;
            final String fUrl = url;
            mactivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mweb.loadUrl(fUrl);
                }
            });
        }
    }
    @JavascriptInterface
    public void topgo(final String url){
        if(!TextUtils.isEmpty(url)){
            ActivityManager.getInstance().finishButFirst();
            ActivityManager.getInstance().start(url);
        }
    }


    //数据存储
    @JavascriptInterface
    public void storageValue(String obj) {
        try{
            JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("storageValue",jb.getString("code"));
            SharedPreferences sp = mactivity.getSharedPreferences(saveKey, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sp.edit();
            String key = jb.getString("key");
            String value = jb.getString("value");
            editor.putString(key, value);
            editor.commit();
            mweb.setValue("storageValue", value);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    //数据读取
    @JavascriptInterface
    public void storage(String obj) {
        try {
            JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("storage",jb.getString("code"));
            SharedPreferences sp = mactivity.getSharedPreferences(saveKey, Context.MODE_PRIVATE);
            String val = sp.getString(jb.getString("key"), "");
            mweb.setValue("storage", val);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @JavascriptInterface
    public void getVersion(String code){
        try{
            mweb.setInsCode("getVersion",code);
            PackageManager pm = mactivity.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(mactivity.getPackageName(), 0);
            mweb.setValue("getVersion", "{\"versionName\":\""+pi.versionName+"\",\"versionCode\":\"" + pi.versionCode + "\",\"versionType\":\"android\"}");
        }catch (Exception e){}
    }

    //comfirm弹窗
    @JavascriptInterface
    public void confirm(String obj) {
        try {
            JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("confirm",jb.getString("code"));
            showConfirm(jb.getString("mess"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void showConfirm(String mess){
        MessageDialog.show(mactivity, "提示", mess, "确定", "取消")
                .setButtonOrientation(LinearLayout.HORIZONTAL)
                .setOnOkButtonClickListener(new OnDialogButtonClickListener() {
                    @Override
                    public boolean onClick(BaseDialog baseDialog, View v) {
                        mweb.setValue("confirm","1");
                        baseDialog.doDismiss();
                        return false;
                    }
                })
                .setOnCancelButtonClickListener(new OnDialogButtonClickListener() {
                    @Override
                    public boolean onClick(BaseDialog baseDialog, View v) {
                        mweb.setValue("confirm","0");
                        baseDialog.doDismiss();
                        return false;
                    }
                });
    }

    //alert弹窗
    @JavascriptInterface
    public void alert(String obj) {
        try {
            JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("alert",jb.getString("code"));
            showAlert(jb.getString("mess"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void showAlert(String mess){
        MessageDialog.show(mactivity, "提示",mess, "确定")
                .setOnOkButtonClickListener(new OnDialogButtonClickListener() {
                    @Override
                    public boolean onClick(BaseDialog baseDialog, View v) {
                        mweb.setValue("alert","1");
                        baseDialog.doDismiss();
                        return false;
                    }
                });
    }

    //message弹窗
    @JavascriptInterface
    public void message(String mess) {
        Toast toast = Toast.makeText(mactivity.getApplicationContext(), mess,
                Toast.LENGTH_SHORT);
        //可以控制toast显示的位置
        toast.setGravity(Gravity.CENTER|Gravity.CENTER, 0, 0);
        toast.show();
    }


    //获取缓存大小
    @JavascriptInterface
    public void getCacheSize(String code) {
        mweb.setInsCode("getCacheSize", code);
        String gs = BaseTools.getCacheSize(mactivity);
        mweb.setValue("getCacheSize",gs);
    }
    //清除缓存
    @JavascriptInterface
    public void clearCache(String code) {
        mweb.setInsCode("clearCache", code);
        BaseTools.clearAllCache(mactivity);
        mweb.setValue("clearCache","1");
    }


    @JavascriptInterface
    public void upimg(String obj) {
        try{
            final JSONObject jb = new JSONObject(obj);
            mweb.setInsCode("upimg",jb.getString("code"));
            UpImger.getInstance().upimgs(jb, mactivity, mweb);
        }catch(Exception e){

        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @JavascriptInterface
    public void scanf(String code) {
        if (ContextCompat.checkSelfPermission(mactivity,
                Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            mactivity.requestPermissions(
                    new String[]{Manifest.permission.CAMERA},
                    REQUEST_CODE_SCAN);
        } else {
            Intent intent = new Intent(mactivity, TestScanActivity.class);
            mactivity.startActivityForResult(intent, REQUEST_CODE_SCAN);
            BaseActivity.tempcode = code;
        }

    }

    /**
     * 弹出键盘
     * @param code
     */

    @JavascriptInterface
    public void PopUpKeyboard(String code){
        int widths = View.MeasureSpec.makeMeasureSpec(0,
                View.MeasureSpec.UNSPECIFIED);
        int heights = View.MeasureSpec.makeMeasureSpec(0,
                View.MeasureSpec.UNSPECIFIED);
        mweb.measure(widths, heights);

        final int measuredHeight = mweb.getMeasuredHeight();// 获取高度
        try {
            JSONObject jb = new JSONObject(code);
            String codes  = jb.getString("code");
            mweb.setInsCode("PopUpKeyboard",jb.getString("cb"));
            Log.e("111111111", "PopUpKeyboard: "+"1111111");
            InputMethodManager imm = (InputMethodManager) mactivity.getSystemService(Context.INPUT_METHOD_SERVICE);
            if (codes.equals("1")&&imm!=null){
                imm.showSoftInput(mweb, 0);
            }else {
                imm.hideSoftInputFromWindow(mactivity.getCurrentFocus().getWindowToken(),InputMethodManager.HIDE_NOT_ALWAYS);

                mweb.setValue("PopUpKeyboard","1");
            }
           //   getViewHeight();
        }catch (Exception e){

        }

    }


    @JavascriptInterface
    public void upSlide(String type){
        mweb.setInsCode("upSlide",type);
        if (type.equals("1")){
            mweb.setOnTouchListener(new View.OnTouchListener() {
            @Override
           public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    mactivity.isSingleTap = false;
               }
               mactivity.gestureDetector.onTouchEvent(event);
               if (mactivity.isSingleTap && event.getAction() == MotionEvent.ACTION_UP) {
                   return true;
               }
                return mactivity.onTouchEvent(event);
           }
            });
        }else {
            mweb.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    return false;
                }
            });
        }
    }

    /**
     * 打开系统短信邮箱
     * @param type
     */
    @JavascriptInterface
    public void playME(String type){
         if (type.equals("1")){
             //短信
             Intent it = new Intent(Intent.ACTION_VIEW);
             it.putExtra("sms_body", "The SMS text");
             it.setType("vnd.android-dir/mms-sms");
             mactivity.startActivity(it);
         }else {
             //邮箱
             try {
                 Uri uri = Uri.parse("mailto:xxx@abc.com");
                 Intent it = new Intent(Intent.ACTION_SENDTO, uri);
                 mactivity.startActivity(it);
             } catch (Exception e) {
                 Toast.makeText(mactivity, "打开邮箱失败", Toast.LENGTH_SHORT).show();
             }
         }
    }


    @JavascriptInterface
    public void navigation(String obj) {
        Log.e("navigation", "navigation: " + obj);
        try{
            JSONObject jb = new JSONObject(obj);
            Intent intent = new Intent(mactivity,MapviewActivity.class);
            intent.putExtra("jb",jb.toString());
            mactivity.startActivity(intent);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @JavascriptInterface
    public void gologin(String code){
        Intent intent = new Intent(mactivity, MainActivity.class);
        intent.putExtra("sendUrl","login.html");
        mactivity.startActivity(intent);
    }


    @JavascriptInterface
    public void  godismiss(String code){
        Intent intent = new Intent(mactivity, MainActivity.class);
        intent.putExtra("sendUrl","index.html");
        mactivity.startActivity(intent);
    }


}
