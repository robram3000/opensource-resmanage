from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from form.loginform import LoginForm


user_management_bp = Blueprint('user_management', __name__, template_folder='templates')

@user_management_bp.route('',methods = ['get','post'])
def add_user_staff():
    
    return

@user_management_bp.route('',methods=['Get' , 'Post'])
def edit_user_staff():
    
    return

@user_management_bp.route('',methods=['Get' , 'Post'])
def archive_user_staff():
    
    return

@user_management_bp.route('',methods=['Get' , 'Post'])
def delete_user_staff():
    
    return

@user_management_bp.route('',methods=['get','post'])
def edit_user_supplier():
    return

@user_management_bp.route('',methods=['get','post'])
def add_user_supplier():

    return

@user_management_bp.route('',methods=['get','post'])
def add_user_supplier():

    return


def init_app(app):
    app.register_blueprint(user_management_bp)