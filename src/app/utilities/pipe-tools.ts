import { Component, Pipe, PipeTransform } from '@angular/core';
import { isUndefined } from 'util';

@Pipe({ name: 'removeStringTime' })
export class RemoveStringTime implements PipeTransform {

  transform(str: string): any {

    if(!isUndefined(str))
      return str.split(' ')[0].split('/')[1] + '/' + str.split(' ')[0].split('/')[0] + '/' + str.split(' ')[0].split('/')[2];
    else
      return '';

  }
}