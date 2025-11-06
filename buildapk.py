import glob
import subprocess
import shutil
import os
import requests
import platform
from zipfile import ZipFile

is_windows = platform.system() == 'Windows'

dir_base_apk = "./apk/base/"
if not os.path.exists(dir_base_apk):
    os.makedirs(dir_base_apk)

dir_patched_apk = "./apk/patched/"
if not os.path.exists(dir_patched_apk):
    os.makedirs(dir_patched_apk)

dir_signed_apk = "./apk/signed/"
if not os.path.exists(dir_signed_apk):
    os.makedirs(dir_signed_apk)

dir_tools = './tools/'
if not os.path.exists(dir_tools):
    os.makedirs(dir_tools)

apk_url = 'https://d.cdnpure.com/b/XAPK/com.kms.worlddaistar?version=latest'

# smali inject
inject_code = """invoke-direct {p0}, Lcom/unity3d/player/UnityPlayerActivity;-><init>()V
    const-string v0, "gadget"
	invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V
"""

def download_apk():
    print('Starting to download XAPK...')
    response = requests.get("https://d.cdnpure.com/b/XAPK/com.kms.worlddaistar?version=latest")
    with open("./apk/sirius.xapk", 'wb') as f:
        f.write(response.content)

def unzip_apk(dirpath = './apk'):
    print('Starting to unzip the XAPK...')
    with ZipFile('./apk/sirius.xapk', 'r') as zip_file:
        zip_file.extractall(path=dirpath)    

# Unpacking Packages
def unpack_apk(target = dir_base_apk):
    print('Starting to unpack the XAPK...')
    subprocess.run(['java', '-jar', os.path.join(dir_tools, 'apktool.jar'), 'd', os.path.join('./apk', 'com.kms.worlddaistar.apk'), '-f', '-o', os.path.join(target, 'com.kms.worlddaistar')], check=True, shell=is_windows)
    subprocess.run(['java', '-jar', os.path.join(dir_tools, 'apktool.jar'), 'd', os.path.join('./apk', 'config.arm64_v8a.apk'), '-f', '-o', os.path.join(target, 'config.arm64_v8a')], check=True, shell=is_windows)
    subprocess.run(['java', '-jar', os.path.join(dir_tools, 'apktool.jar'), 'd', os.path.join('./apk', 'UnityDataAssetPack.apk'), '-f', '-o', os.path.join(target, 'UnityDataAssetPack')], check=True, shell=is_windows)

# modfiy Packages / Injecting
def modfiy_packages(target = dir_base_apk):
    print('Starting to modfiy the packages...')
    target_smali = glob.glob(os.path.join(target, 'com.kms.worlddaistar', '*/com/kms/worlddaistar/UnityPlayerActivityOverride.smali'))[0]
    with open(target_smali, 'r+') as f:
        text = f.read()
        text = text.replace('invoke-direct {p0}, Lcom/unity3d/player/UnityPlayerActivity;-><init>()V', inject_code)
        f.seek(0)
        f.write(text)
        f.truncate()

    target_gadet = glob.glob('./frida/*gadget-*android-arm64.so')[0]
    shutil.copy(target_gadet, os.path.join(dir_base_apk, 'config.arm64_v8a/lib/arm64-v8a', 'libgadget.so'))
    shutil.copy('./frida/libgadget.config.so', os.path.join(dir_base_apk, 'config.arm64_v8a/lib/arm64-v8a', 'libgadget.config.so'))
    shutil.copy('./dist/_.js', os.path.join(dir_base_apk, 'config.arm64_v8a/lib/arm64-v8a', 'libgadget.js.so'))
    
# Repacking Packages
def repack_packages(inputdir=dir_base_apk, outputdir=dir_patched_apk):
    print('Starting to repack the packages...')
    subprocess.run(['java', '-jar', os.path.join(dir_tools, 'apktool.jar'), 'b', os.path.join(inputdir, 'com.kms.worlddaistar'), '-o', os.path.join(outputdir, 'base_frida.apk')], check=True, shell=is_windows)
    subprocess.run(['java', '-jar', os.path.join(dir_tools, 'apktool.jar'), 'b', os.path.join(inputdir, 'config.arm64_v8a'), '-o', os.path.join(outputdir, 'config_frida.apk')], check=True, shell=is_windows)
    subprocess.run(['java', '-jar', os.path.join(dir_tools, 'apktool.jar'), 'b', os.path.join(inputdir, 'UnityDataAssetPack'), '-o', os.path.join(outputdir, 'unity.apk')], check=True, shell=is_windows)

# Signing Packages
def sign_apks(inputdir=dir_patched_apk, outputdir=dir_signed_apk):
    subprocess.run(['jarsigner', '-verbose', '-keystore', os.path.join(dir_tools, 'wds.keystore'), '-storepass', '123456', '-signedjar', os.path.join(outputdir, 'base_frida_signed.apk'), os.path.join(inputdir, 'base_frida.apk'), 'wdskey'], check=True, shell=is_windows)
    subprocess.run(['jarsigner', '-verbose', '-keystore', os.path.join(dir_tools, 'wds.keystore'), '-storepass', '123456', '-signedjar', os.path.join(outputdir, 'config_frida_signed.apk'), os.path.join(inputdir, 'config_frida.apk'), 'wdskey'], check=True, shell=is_windows)
    subprocess.run(['jarsigner', '-verbose', '-keystore', os.path.join(dir_tools, 'wds.keystore'), '-storepass', '123456', '-signedjar', os.path.join(outputdir, 'unity_signed.apk'), os.path.join(inputdir, 'unity.apk'), 'wdskey'], check=True, shell=is_windows)
    
def chack_signer():
    if not os.path.exists(os.path.join(dir_tools, 'wds.keystore')):
        print('Can not found the KEYSTORE in tools folder, Generate Now')
        subprocess.run(['keytool', '-genkey', '-v', '-keystore', os.path.join(dir_tools, 'wds.keystore'), '-alias', 'wdskey', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-storepass', '123456', '-dname', 'CN=WDSModed,OU=WDSModed,O=WDSModed,L=WDSModed,S=WDSModed,C=WDSModed'])

if __name__ == '__main__':
    download_apk()
    unzip_apk()
    unpack_apk()
    modfiy_packages()
    repack_packages()
    chack_signer()
    sign_apks()


# adb install-multiple base_frida_signed.apk config_frida_signed.apk unity_signed.apk